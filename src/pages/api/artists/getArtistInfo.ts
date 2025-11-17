import { CacheTTL, CacheUtils } from '@utils/cache-utils'

import type { APIRoute } from 'astro'
import { ArtistController } from '@artist/controlers'
import { ResponseBuilder } from '@utils/response-builder'
import { redisConnection } from '@middlewares/redis-connection'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const artistName = ArtistController.validateArtistName(url)
    const cacheKey = CacheUtils.generateKey('artist-info', artistName)

    const data = await CacheUtils.withCache(
      cacheKey,
      () => ArtistController.handleGetArtistInfo(url),
      { ttl: CacheTTL.ONE_DAY }
    )

    return ResponseBuilder.success({ data })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/artist/getArtistInfo')
  }
})
