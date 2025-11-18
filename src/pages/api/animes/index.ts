import { AnimeController } from '@anime/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = CacheUtils.generateKey(
        'animes-partial',
        url.searchParams
      )

      const result = await CacheUtils.withCache(
        cacheKey,
        () => AnimeController.handleSearchAnime(url),
        { ttl: CacheTTL.ONE_HOUR * 2 }
      )

      return ResponseBuilder.success(result)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/animes')
    }
  })
)
