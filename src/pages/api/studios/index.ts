import { CacheTTL, CacheUtils } from '@utils/cache-utils'

import { AnimeService } from '@anime/services'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async () => {
  try {
    const data = await CacheUtils.withCache(
      'studios',
      () => AnimeService.getStudios(),
      { ttl: CacheTTL.ONE_WEEK * 52 } // 1 year
    )

    return ResponseBuilder.success(data)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/studios')
  }
})
