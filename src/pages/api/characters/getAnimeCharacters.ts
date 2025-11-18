import { CharacterController } from '@character/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const { animeId, language } =
        CharacterController.validateAnimeCharactersParams(url)
      const cacheKey = CacheUtils.generateKey(
        'anime-characters',
        `${animeId}-${language}`
      )

      const data = await CacheUtils.withCache(
        cacheKey,
        () => CharacterController.handleGetAnimeCharacters(url),
        { ttl: CacheTTL.ONE_DAY }
      )

      return ResponseBuilder.success({ data })
    } catch (error) {
      return ResponseBuilder.fromError(
        error,
        'GET /api/characters/getAnimeCharacters'
      )
    }
  })
)
