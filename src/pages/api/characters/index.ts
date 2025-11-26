import { CharacterController } from '@character/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = CacheUtils.generateKey('characters', url.searchParams)

      const response = await CacheUtils.withCache(
        cacheKey,
        () => CharacterController.handleSearch(url),
        { ttl: CacheTTL.ONE_DAY }
      )

      return ResponseBuilder.success(response)
    } catch (err) {
      return ResponseBuilder.fromError(err, 'GET /api/characters')
    }
  })
)
