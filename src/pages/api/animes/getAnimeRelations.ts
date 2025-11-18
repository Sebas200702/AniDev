import { AnimeController } from '@anime/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const animeId = AnimeController.validateAnimeId(url)
      const cacheKey = CacheUtils.generateKey('anime-relations', animeId)

      const data = await CacheUtils.withCache(
        cacheKey,
        () => AnimeController.handleGetAnimeRelations(url),
        { ttl: CacheTTL.ONE_DAY }
      )

      return ResponseBuilder.success({ data })
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/animes/getAnimeRelations')
    }
  })
)
