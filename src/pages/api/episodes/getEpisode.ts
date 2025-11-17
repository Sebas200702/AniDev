import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import { EpisodeController } from '@watch/controlers'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = CacheUtils.generateKey('episode', url.searchParams)

      const episode = await CacheUtils.withCache(
        cacheKey,
        () => EpisodeController.handleGetEpisode(url),
        { ttl: CacheTTL.ONE_HOUR }
      )

      return ResponseBuilder.success({ episode })
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/episodes/getEpisode')
    }
  })
)
