import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import { EpisodeController } from '@watch/controlers'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const { id, page } = EpisodeController.validateRequest(url)
      const cacheKey = `episodes:${id}-${page}`

      const data = await CacheUtils.withCache(
        cacheKey,
        () => EpisodeController.handleGetEpisodes(url),
        { ttl: CacheTTL.ONE_HOUR }
      )

      return ResponseBuilder.success({ data })
    } catch (error: any) {
      return ResponseBuilder.fromError(error, 'GET /api/episodes')
    }
  })
)
