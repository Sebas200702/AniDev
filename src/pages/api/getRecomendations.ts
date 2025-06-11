import { SchemaType } from '@google/generative-ai'
import { model } from '@libs/gemini'
import { fetchRecomendations } from '@utils/fetch-recomendations'
import { generateContextualPrompt } from '@utils/get-recomendation-context'
import { getUserDataToRecomendations } from '@utils/get-user-data-to-recomendations'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'
import type { RecommendationContext } from 'types'

const fetchRecomendationsFunctionDeclaration = {
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
}

export const GET: APIRoute = async ({ request, cookies, url }) => {
  try {
    const userInfo = await getSessionUserInfo({
      request,
      accessToken: cookies.get('sb-access-token')?.value,
      refreshToken: cookies.get('sb-refresh-token')?.value,
    })

    const userName = userInfo?.name

    const isAuth = !!userName

    const contextType =
      (url.searchParams.get('context') as RecommendationContext['type']) ||
      'general'
    const searchQuery = url.searchParams.get('searchQuery') || undefined
    const currentAnime = url.searchParams.get('currentAnime') || undefined
    const mood = url.searchParams.get('mood') || undefined
    const referenceAnime = url.searchParams.get('referenceAnime') || undefined
    const season = url.searchParams.get('season') || undefined
    const timeAvailable = url.searchParams.get('timeAvailable') || undefined
    const count = parseInt(url.searchParams.get('count') || '24') || undefined
    const focus = url.searchParams.get('focus') || undefined

    const context: RecommendationContext = {
      type: contextType,
      data: {
        searchQuery,
        currentAnime,
        mood,
        referenceAnime,
        season,
        timeAvailable,
      },
      count,
      focus: focus,
    }

    const { userProfile, calculatedAge, error } =
      await getUserDataToRecomendations(userName, isAuth)

    if (error || !userProfile || !calculatedAge) {
      return new Response(JSON.stringify({ error: error }), {
        status: 500,
      })
    }

    const prompt = generateContextualPrompt(
      userProfile,
      calculatedAge,
      context,
      currentAnime
    )

    const initialResponse = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const getRecomendations = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                initialResponse.response.candidates?.[0]?.content?.parts?.[0]
                  ?.text || '',
            },
          ],
        },
      ],
      tools: [
        { functionDeclarations: [fetchRecomendationsFunctionDeclaration] },
      ],
    })

    const functionCall =
      getRecomendations.response?.candidates?.[0]?.content?.parts?.[0]
        ?.functionCall

    if (functionCall) {
      const requestedIds = Object.values(functionCall.args)?.[0] as string[]
      const targetCount = context.count || 24
      let functionResult = await fetchRecomendations(
        requestedIds,
        targetCount,
        currentAnime
      )
      let wasRetried = false

      if (functionResult.length < targetCount * 0.95) {
        wasRetried = true
        console.log(
          `Insufficient results (${functionResult.length}/${targetCount}). Retrying with fallback strategy.`
        )

        const retryPrompt = `Las recomendaciones anteriores solo retornaron ${functionResult.length} de ${targetCount} animes solicitados.
        Esto indica que muchos mal_ids no existen en nuestra base de datos.

        Por favor, genera ${targetCount} recomendaciones diferentes usando mal_ids de animes MÁS POPULARES Y CONOCIDOS
        que probablemente estén en cualquier base de datos de anime (como los top 100 de MyAnimeList).

        Contexto del usuario: ${JSON.stringify(context)}`

        try {
          const retry = await model.generateContent({
            contents: [
              {
                role: 'user',
                parts: [{ text: retryPrompt }],
              },
            ],
            tools: [
              {
                functionDeclarations: [fetchRecomendationsFunctionDeclaration],
              },
            ],
          })

          const retryFunctionCall =
            retry.response?.candidates?.[0]?.content?.parts?.[0]?.functionCall

          if (retryFunctionCall) {
            const retryIds = Object.values(
              retryFunctionCall.args
            )?.[0] as string[]
            const retryResult = await fetchRecomendations(
              retryIds,
              targetCount,
              currentAnime
            )

            const combinedResults = [...functionResult]
            const existingIds = new Set(
              functionResult.map((anime) => anime.mal_id)
            )

            for (const anime of retryResult) {
              if (!existingIds.has(anime.mal_id)) {
                combinedResults.push(anime)
                if (combinedResults.length >= targetCount) break
              }
            }

            functionResult = combinedResults
            console.log(
              `Retry completed. Final count: ${functionResult.length}`
            )
          }
        } catch (retryError) {
          console.error('Retry attempt failed:', retryError)
        }

        if (functionResult.length < targetCount) {
          console.log(
            `Still insufficient after retry (${functionResult.length}/${targetCount}). Forcing direct fallback.`
          )
          functionResult = await fetchRecomendations(
            [],
            targetCount,
            currentAnime
          )
        }
      }

      return new Response(
        JSON.stringify({
          data: functionResult,
          context: context,
          totalRecommendations: functionResult?.length || 0,
          wasRetried,
        }),
        {
          status: 200,
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          error: 'Could not generate recommendations. Please try again.',
          recommendations: [],
          context: context,
        }),
        {
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
}
