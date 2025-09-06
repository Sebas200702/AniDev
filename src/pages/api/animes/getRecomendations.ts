import { buildResponse, cacheAndRespond } from '@utils/response-builder'

import { SchemaType, type Tool } from '@google/generative-ai'
import { model } from '@libs/gemini'
import { GeminiQuota } from '@libs/gemini-quota'
import { safeRedisOperation } from '@libs/redis'
import { fetchRecomendations } from '@utils/fetch-recomendations'
import { getJikanRecommendations } from '@utils/get-jikan-recommendations'
import { generateContextualPrompt } from '@utils/get-recomendation-context'
import { getUserDataToRecomendations } from '@utils/get-user-data-to-recomendations'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import { createJikanFallback } from '@utils/jikan-fallback'
import { pickAnimeForJikan } from '@utils/pick-anime-for-jikan'
import type { APIRoute } from 'astro'
import type { RecommendationContext } from 'types'

const functionTool: Tool = {
  functionDeclarations: [
    {
      name: 'fetch_recommendations',
      description:
        'Usa las recomendaciones generadas por el modelo para obtener los anime que se encuentren en la base de datos.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          mal_ids: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.STRING,
            },
            description:
              'Usa las recomendaciones generadas por el modelo para obtener los anime que se encuentren en la base de datos.',
          },
        },
        required: ['mal_ids'],
      },
    },
  ],
}

export const GET: APIRoute = async ({ request, cookies, url }) => {
  try {
    const userInfo = await getSessionUserInfo({
      request,
      accessToken: cookies.get('sb-access-token')?.value,
      refreshToken: cookies.get('sb-refresh-token')?.value,
    })
    const userName = userInfo?.name ?? ''
    const { userProfile, calculatedAge, error } =
      await getUserDataToRecomendations(userName, !!userName)
    if (error || !userProfile || !calculatedAge)
      return new Response(JSON.stringify({ error }), { status: 500 })
    const cacheKey = `recommendations-${userName}:${url.searchParams.toString()}`
    const cached = await safeRedisOperation((c) => c.get(cacheKey))
    if (cached)
      return new Response(cached, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      })

    const context: RecommendationContext = {
      type:
        (url.searchParams.get('context') as RecommendationContext['type']) ||
        'general',
      data: {
        searchQuery: url.searchParams.get('searchQuery') || undefined,
        currentAnime: url.searchParams.get('currentAnime') || undefined,
        mood: url.searchParams.get('mood') || undefined,
        referenceAnime: url.searchParams.get('referenceAnime') || undefined,
        season: url.searchParams.get('season') || undefined,
        timeAvailable: url.searchParams.get('timeAvailable') || undefined,
      },
      count: parseInt(url.searchParams.get('count') || '24'),
      focus: url.searchParams.get('focus') || undefined,
      parentalControl: url.searchParams.get('parental_control') === 'true',
    }

    let animeForJikan: string | undefined
    let isFromFavorites: boolean | undefined
    let selectedFavoriteTitle: string | undefined
    if (!context.data.currentAnime) {
      ;({ animeForJikan, isFromFavorites, selectedFavoriteTitle } =
        await pickAnimeForJikan(userProfile))
    } else {
      animeForJikan = context.data.currentAnime
    }

    const jikan = animeForJikan
      ? await getJikanRecommendations(animeForJikan)
      : null

    const prompt = generateContextualPrompt(
      userProfile,
      calculatedAge,
      context,
      context.data.currentAnime,
      jikan,
      isFromFavorites ? animeForJikan : undefined
    )

    if (!(await GeminiQuota.canUse())) {
      const data = await createJikanFallback(
        jikan,
        context.count || 24,
        context.data.currentAnime,
        context.parentalControl
      )
      return cacheAndRespond(
        cacheKey,
        buildResponse({
          data,
          context,
          quotaExhausted: true,
          fallbackUsed: 'jikan',
          jikan,
          animeForJikan,
          isFromFavorites,
          favoriteTitle: selectedFavoriteTitle,
        }),
        { 'X-Fallback': 'quota-exhausted' }
      )
    }

    await GeminiQuota.increment()

    const maxRetries = 2
    let geminiResp
    let fnCall
    let retryCount = 0

    while (retryCount <= maxRetries) {
      try {
        geminiResp = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${prompt} INSTRUCCIÓN CRÍTICA: Debes usar fetch_recommendations y generar una lista de IDs de anime. Responde SOLO con la función fetch_recommendations.`,
                },
              ],
            },
          ],
          tools: [functionTool],
        })

        fnCall =
          geminiResp.response?.candidates?.[0]?.content?.parts?.[0]
            ?.functionCall

        if (fnCall && fnCall.name === 'fetch_recommendations') {
          break
        }

        retryCount++
        if (retryCount <= maxRetries) {
          console.warn(
            `Gemini no generó función válida, reintentando... (${retryCount}/${maxRetries})`
          )

          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      } catch (geminiError) {
        console.error('Error en Gemini:', geminiError)
        retryCount++
        if (retryCount <= maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }
    }

    if (!fnCall || fnCall.name !== 'fetch_recommendations') {
      console.warn(
        'Gemini falló en generar función válida, usando fallback de Jikan'
      )
      const data = await createJikanFallback(
        jikan,
        context.count || 24,
        context.data.currentAnime,
        context.parentalControl
      )
      return cacheAndRespond(
        cacheKey,
        buildResponse({
          data,
          context,
          quotaExhausted: false,
          fallbackUsed: 'api-error',
          jikan,
          animeForJikan,
          isFromFavorites,
          favoriteTitle: selectedFavoriteTitle,
        }),
        { 'X-Fallback': 'gemini-failed' }
      )
    }

    const ids = Object.values(fnCall.args)?.[0] as string[]

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.warn('IDs inválidos de Gemini, usando fallback de Jikan')
      const data = await createJikanFallback(
        jikan,
        context.count || 24,
        context.data.currentAnime,
        context.parentalControl
      )
      return cacheAndRespond(
        cacheKey,
        buildResponse({
          data,
          context,
          quotaExhausted: false,
          fallbackUsed: 'api-error',
          jikan,
          animeForJikan,
          isFromFavorites,
          favoriteTitle: selectedFavoriteTitle,
        }),
        { 'X-Fallback': 'invalid-ids' }
      )
    }

    const result = await fetchRecomendations(
      ids,
      context.count,
      context.data.currentAnime,
      jikan,
      context.parentalControl
    )

    return cacheAndRespond(
      cacheKey,
      buildResponse({
        data: result,
        context,
        jikan,
        animeForJikan,
        isFromFavorites,
        favoriteTitle: selectedFavoriteTitle,
      })
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
}
