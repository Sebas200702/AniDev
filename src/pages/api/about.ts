import { redisConnection } from '@middlewares/redis-connection'
import { formatAbout } from '@shared/utils/format-about'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const about = url.searchParams.get('about')

    if (!about) {
      return ResponseBuilder.validationError('Missing about parameter')
    }

    const cacheKey = CacheUtils.generateKey('about', url.searchParams)
    const formatted = await CacheUtils.withCache(
      cacheKey,
      () => formatAbout(about),
      { ttl: CacheTTL.ONE_DAY }
    )

    return ResponseBuilder.success(formatted)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/about')
  }
})
