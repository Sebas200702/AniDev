import { safeRedisOperation } from '@libs/redis'
import { type BuildResponseOptions } from '@shared/ai/types'

export const buildResponse = ({
  data,
  context,
  wasRetried = false,
  quotaExhausted = false,
  fallbackUsed = null,
  jikan,
  animeForJikan,
  isFromFavorites,
  favoriteTitle,
}: BuildResponseOptions) => {
  return {
    data,
    context,
    totalRecommendations: data.length,
    wasRetried,
    quotaExhausted,
    fallbackUsed,
    jikanRecommendations: jikan?.mal_ids?.length
      ? {
          count: jikan.mal_ids.length,
          titles: jikan.titles.slice(0, 5),
          basedOn: isFromFavorites
            ? `favorite_anime_${animeForJikan}`
            : `current_anime_${animeForJikan}`,
          isFromFavorites,
          favoriteTitle: isFromFavorites ? favoriteTitle : undefined,
        }
      : null,
  }
}

export async function cacheAndRespond(key: string, payload: any, headers = {}) {
  await safeRedisOperation((c) =>
    c.set(key, JSON.stringify(payload), { EX: 21600 })
  )
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}
