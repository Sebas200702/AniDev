import { redisConnection } from '@middlewares/redis-connection'
import { MusicController } from '@music/controlers'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const animeId = MusicController.validateAnimeId(url)
    const cacheKey = CacheUtils.generateKey('anime-music', String(animeId))

    const data = await CacheUtils.withCache(
      cacheKey,
      () => MusicController.handleGetAnimeMusic(url),
      { ttl: CacheTTL.ONE_DAY }
    )

    return ResponseBuilder.success({ data })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/music/getAnimeMusic')
  }
})
