import { SchemaType, type Tool } from '@google/generative-ai'
import { model } from '@libs/gemini'
import { safeRedisOperation } from '@libs/redis'
import { fetchRecomendations } from '@utils/fetch-recomendations'
import { getFavoriteAnimeIds } from '@utils/get-favorite-anime-ids'
import { getJikanRecommendations } from '@utils/get-jikan-recommendations'
import { generateContextualPrompt } from '@utils/get-recomendation-context'
import { getUserDataToRecomendations } from '@utils/get-user-data-to-recomendations'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'
import type { RecommendationContext } from 'types'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Sistema de monitoreo de cuota Gemini
class GeminiQuotaManager {
  private static readonly QUOTA_KEY = 'gemini_quota_usage'
  private static readonly DAILY_LIMIT = 180 // Dejamos margen de seguridad (200 - 20)
  private static readonly RESET_HOUR = 0 // UTC

  static async canMakeRequest(): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]
    const quotaKey = `${this.QUOTA_KEY}:${today}`

    const currentUsage = await safeRedisOperation((client) =>
      client.get(quotaKey)
    )

    const usage = currentUsage ? parseInt(currentUsage) : 0
    return usage < this.DAILY_LIMIT
  }

  static async incrementUsage(): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const quotaKey = `${this.QUOTA_KEY}:${today}`

    await safeRedisOperation((client) => client.incr(quotaKey))

    // Establecer expiración a final del día UTC
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)
    const secondsUntilReset = Math.floor(
      (tomorrow.getTime() - Date.now()) / 1000
    )

    await safeRedisOperation((client) =>
      client.expire(quotaKey, secondsUntilReset)
    )
  }

  static async getCurrentUsage(): Promise<number> {
    const today = new Date().toISOString().split('T')[0]
    const quotaKey = `${this.QUOTA_KEY}:${today}`

    const currentUsage = await safeRedisOperation((client) =>
      client.get(quotaKey)
    )

    return currentUsage ? parseInt(currentUsage) : 0
  }
}

// Fallback inteligente sin Gemini
async function createJikanBasedRecommendations(
  jikanRecommendations: { mal_ids: number[]; titles: string[] } | null,
  targetCount: number,
  currentAnime?: string
): Promise<any[]> {
  if (!jikanRecommendations || jikanRecommendations.mal_ids.length === 0) {
    // Si no hay Jikan, usar popular fallback
    return await fetchRecomendations([], targetCount, currentAnime, null)
  }

  // Usar recomendaciones de Jikan como base
  const jikanIds = jikanRecommendations.mal_ids.map((id) => id.toString())
  const jikanResult = await fetchRecomendations(
    jikanIds,
    targetCount,
    currentAnime,
    jikanRecommendations
  )

  if (jikanResult.length >= targetCount * 0.8) {
    return jikanResult
  }

  // Si necesitamos más, agregar populares
  const additionalResult = await fetchRecomendations(
    [],
    targetCount,
    currentAnime,
    jikanRecommendations
  )

  const combined = [...jikanResult]
  const existingIds = new Set(jikanResult.map((anime) => anime.mal_id))

  for (const anime of additionalResult) {
    if (!existingIds.has(anime.mal_id)) {
      combined.push(anime)
      if (combined.length >= targetCount) break
    }
  }

  return combined
}

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
    // Crear clave de cache para recomendaciones
    const cacheKey = `recommendations:${url.searchParams.toString()}`

    // Intentar obtener desde cache (cache de 6 horas para recomendaciones)
    const cachedRecommendations = await safeRedisOperation((client) =>
      client.get(cacheKey)
    )

    if (cachedRecommendations) {
      console.log('Returning cached recommendations')
      return new Response(JSON.stringify(JSON.parse(cachedRecommendations)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
      })
    }

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

    const { userProfile, calculatedAge, error } =
      await getUserDataToRecomendations(userName, isAuth)

    if (error || !userProfile || !calculatedAge) {
      return new Response(JSON.stringify({ error: error }), {
        status: 500,
      })
    }

    let animeForJikan = currentAnime
    let isFromFavorites = false
    let selectedFavoriteTitle = ''

    if (
      !animeForJikan &&
      userProfile.favorite_animes &&
      userProfile.favorite_animes.length > 0
    ) {
      console.log(
        `No currentAnime provided, searching for favorite anime IDs in database`
      )

      const favoriteIdsResult = await getFavoriteAnimeIds(
        userProfile.favorite_animes
      )

      if (favoriteIdsResult.error) {
        console.warn(
          `Error getting favorite anime IDs: ${favoriteIdsResult.error}`
        )
      } else if (favoriteIdsResult.mal_ids.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * favoriteIdsResult.mal_ids.length
        )
        animeForJikan = favoriteIdsResult.mal_ids[randomIndex].toString()
        selectedFavoriteTitle = favoriteIdsResult.matchedTitles[randomIndex]
        isFromFavorites = true

        console.log(
          `Using random favorite anime for Jikan: ${animeForJikan} (${selectedFavoriteTitle})`
        )
        console.log(
          `Found ${favoriteIdsResult.mal_ids.length} favorite anime IDs in database: ${favoriteIdsResult.mal_ids.join(', ')}`
        )
      } else {
        console.log(
          `No favorite anime IDs found in database for titles: ${userProfile.favorite_animes.join(', ')}`
        )
      }
    }

    let jikanRecommendations: {
      mal_ids: number[]
      titles: string[]
      error?: string
    } | null = null
    if (animeForJikan) {
      console.log(
        `Fetching Jikan recommendations for anime: ${animeForJikan} ${isFromFavorites ? `(favorite: ${selectedFavoriteTitle})` : '(current anime)'}`
      )
      jikanRecommendations = await getJikanRecommendations(animeForJikan)
    }

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

    const prompt = generateContextualPrompt(
      userProfile,
      calculatedAge,
      context,
      currentAnime,
      jikanRecommendations,
      isFromFavorites ? animeForJikan : undefined
    )

    const functionPrompt = `${prompt} INSTRUCCIÓN CRÍTICA: Debes usar OBLIGATORIAMENTE la función fetch_recommendations con los MAL_IDs que has seleccionado. NO devuelvas texto plano. Usa la función tool disponible.`

    // Verificar si podemos usar Gemini
    const canUseGemini = await GeminiQuotaManager.canMakeRequest()
    const currentUsage = await GeminiQuotaManager.getCurrentUsage()

    console.log(
      `Gemini quota status: ${currentUsage}/180 requests used today. Can make request: ${canUseGemini}`
    )

    if (!canUseGemini) {
      console.log('Gemini quota exhausted, using Jikan-based fallback')
      const fallbackResult = await createJikanBasedRecommendations(
        jikanRecommendations,
        context.count || 24,
        currentAnime
      )

      const response = {
        data: shuffleArray(fallbackResult),
        context: context,
        totalRecommendations: fallbackResult.length,
        wasRetried: false,
        quotaExhausted: true,
        fallbackUsed: 'jikan',
        jikanRecommendations:
          jikanRecommendations && jikanRecommendations.mal_ids.length > 0
            ? {
                count: jikanRecommendations.mal_ids.length,
                titles: jikanRecommendations.titles.slice(0, 5),
                basedOn: isFromFavorites
                  ? `favorite_anime_${animeForJikan}`
                  : `current_anime_${animeForJikan}`,
                isFromFavorites,
                favoriteTitle: isFromFavorites
                  ? selectedFavoriteTitle
                  : undefined,
              }
            : null,
      }

      // Cachear la respuesta de fallback por menos tiempo (2 horas)
      await safeRedisOperation((client) =>
        client.set(cacheKey, JSON.stringify(response), { EX: 7200 })
      )

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          'X-Fallback': 'quota-exhausted',
        },
      })
    }

    let getRecomendations
    try {
      await GeminiQuotaManager.incrementUsage()
      getRecomendations = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: functionPrompt,
              },
            ],
          },
        ],
        tools: [functionTool],
      })
    } catch (error: any) {
      console.error('Gemini API error:', error.message)

      // Si es error de cuota, usar fallback
      if (error.status === 429) {
        console.log('Gemini quota error detected, using Jikan-based fallback')
        const fallbackResult = await createJikanBasedRecommendations(
          jikanRecommendations,
          context.count || 24,
          currentAnime
        )

        const response = {
          data: shuffleArray(fallbackResult),
          context: context,
          totalRecommendations: fallbackResult.length,
          wasRetried: false,
          quotaExhausted: true,
          fallbackUsed: 'quota-error',
          jikanRecommendations:
            jikanRecommendations && jikanRecommendations.mal_ids.length > 0
              ? {
                  count: jikanRecommendations.mal_ids.length,
                  titles: jikanRecommendations.titles.slice(0, 5),
                  basedOn: isFromFavorites
                    ? `favorite_anime_${animeForJikan}`
                    : `current_anime_${animeForJikan}`,
                  isFromFavorites,
                  favoriteTitle: isFromFavorites
                    ? selectedFavoriteTitle
                    : undefined,
                }
              : null,
        }

        // Cachear la respuesta de fallback por menos tiempo (2 horas)
        await safeRedisOperation((client) =>
          client.set(cacheKey, JSON.stringify(response), { EX: 7200 })
        )

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'MISS',
            'X-Fallback': 'api-error',
          },
        })
      }

      // Para otros errores, re-lanzar
      throw error
    }

    const functionCall =
      getRecomendations.response?.candidates?.[0]?.content?.parts?.[0]
        ?.functionCall

    if (functionCall) {
      const requestedIds = Object.values(functionCall.args)?.[0] as string[]
      const targetCount = context.count || 24
      let functionResult = await fetchRecomendations(
        requestedIds,
        targetCount,
        currentAnime,
        jikanRecommendations
      )
      let wasRetried = false

      if (functionResult.length < targetCount * 0.95) {
        wasRetried = true

        const retryPrompt = `Las recomendaciones anteriores solo retornaron ${functionResult.length} de ${targetCount} animes solicitados.
        Esto indica que muchos mal_ids no existen en nuestra base de datos.

        Por favor, genera ${targetCount} recomendaciones diferentes usando mal_ids de animes MÁS POPULARES Y CONOCIDOS
        que probablemente estén en cualquier base de datos de anime (como los top 100 de MyAnimeList).

        Contexto del usuario: ${JSON.stringify(context)}
        ${
          jikanRecommendations && jikanRecommendations.mal_ids.length > 0
            ? `
        RECOMENDACIONES OFICIALES DE JIKAN para el anime base (${animeForJikan}${isFromFavorites ? ` - anime favorito: ${selectedFavoriteTitle}` : ''}):
        MAL_IDs: ${jikanRecommendations.mal_ids.join(', ')}
        Títulos: ${jikanRecommendations.titles.join(', ')}
        `
            : ''
        }`

        try {
          // Verificar cuota antes del retry
          const canRetry = await GeminiQuotaManager.canMakeRequest()
          if (!canRetry) {
            console.log('Cannot retry with Gemini due to quota exhaustion')
            throw new Error('Quota exhausted for retry')
          }

          await GeminiQuotaManager.incrementUsage()
          const retry = await model.generateContent({
            contents: [
              {
                role: 'user',
                parts: [{ text: retryPrompt }],
              },
            ],
            tools: [functionTool],
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
              currentAnime,
              jikanRecommendations
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
          }
        } catch (retryError) {
          console.error('Retry attempt failed:', retryError)
        }

        if (functionResult.length < targetCount) {
          functionResult = await fetchRecomendations(
            [],
            targetCount,
            currentAnime,
            jikanRecommendations
          )
        }
      }

      const shuffledResults = shuffleArray(functionResult)
      const response = {
        data: shuffledResults,
        context: context,
        totalRecommendations: shuffledResults?.length || 0,
        wasRetried,
        jikanRecommendations:
          jikanRecommendations && jikanRecommendations.mal_ids.length > 0
            ? {
                count: jikanRecommendations.mal_ids.length,
                titles: jikanRecommendations.titles.slice(0, 5),
                basedOn: isFromFavorites
                  ? `favorite_anime_${animeForJikan}`
                  : `current_anime_${animeForJikan}`,
                isFromFavorites,
                favoriteTitle: isFromFavorites
                  ? selectedFavoriteTitle
                  : undefined,
              }
            : null,
      }

      // Cachear respuesta exitosa por 6 horas
      await safeRedisOperation((client) =>
        client.set(cacheKey, JSON.stringify(response), { EX: 21600 })
      )

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
        },
      })
    }

    const responseText =
      getRecomendations.response?.candidates?.[0]?.content?.parts?.[0]?.text
    console.error(
      '❌ Model did not use function tool. Response type:',
      typeof responseText
    )
    console.error('❌ Raw response:', responseText?.substring(0, 200) + '...')

    if (responseText) {
      const malIdMatches = responseText.match(/\b\d{4,6}\b/g)
      if (malIdMatches && malIdMatches.length >= 10) {
        const fallbackResult = await fetchRecomendations(
          malIdMatches.slice(0, context.count || 24),
          context.count || 24,
          currentAnime,
          jikanRecommendations
        )

        if (fallbackResult.length > 0) {
          const shuffledFallback = shuffleArray(fallbackResult)
          const fallbackResponse = {
            data: shuffledFallback,
            context: context,
            totalRecommendations: shuffledFallback.length,
            wasRetried: false,
            fallbackUsed: 'text-parsing',
            jikanRecommendations:
              jikanRecommendations && jikanRecommendations.mal_ids.length > 0
                ? {
                    count: jikanRecommendations.mal_ids.length,
                    titles: jikanRecommendations.titles.slice(0, 5),
                    basedOn: isFromFavorites
                      ? `favorite_anime_${animeForJikan}`
                      : `current_anime_${animeForJikan}`,
                    isFromFavorites,
                    favoriteTitle: isFromFavorites
                      ? selectedFavoriteTitle
                      : undefined,
                  }
                : null,
          }

          // Cachear respuesta fallback por 3 horas
          await safeRedisOperation((client) =>
            client.set(cacheKey, JSON.stringify(fallbackResponse), {
              EX: 10800,
            })
          )

          return new Response(JSON.stringify(fallbackResponse), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'MISS',
              'X-Fallback': 'text-parsing',
            },
          })
        }
      }
    }

    return new Response(
      JSON.stringify({
        error: 'Model failed to use function tool correctly. Please try again.',
        recommendations: [],
        context: context,
        debugInfo: {
          responseType: typeof responseText,
          hasText: !!responseText,
          textLength: responseText?.length || 0,
        },
      }),
      {
        status: 400,
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
}
