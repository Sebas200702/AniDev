import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { MusicController } from '@music/controllers'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = CacheUtils.generateKey('music', url.searchParams)

      const response = await CacheUtils.withCache(
        cacheKey,
        () => MusicController.handleSearch(url),
        { ttl: CacheTTL.ONE_DAY }
      )

      return ResponseBuilder.success(response)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/music')
    }
  })
)
