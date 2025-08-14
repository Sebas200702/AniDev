import { safeRedisOperation } from '@libs/redis'
import { type BuildResponseOptions } from 'types'

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
    data: shuffleArray(data),
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

function shuffleArray<T>(arr: T[]) {
  return arr
    .map((item) => [Math.random(), item] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map(([, item]) => item)
}
