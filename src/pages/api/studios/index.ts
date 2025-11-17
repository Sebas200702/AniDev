import { CacheTTL, CacheUtils } from '@utils/cache-utils'

import type { APIRoute } from 'astro'
import { AnimeService } from '@anime/services'
import { ResponseBuilder } from '@utils/response-builder'
import { rateLimit } from '@middlewares/rate-limit'

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
