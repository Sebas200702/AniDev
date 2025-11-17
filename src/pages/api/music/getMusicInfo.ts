import { redisConnection } from '@middlewares/redis-connection'
import { MusicController } from '@music/controlers'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const themeId = MusicController.validateThemeId(url)
    const cacheKey = `MusicInfo_${themeId}`

    const data = await CacheUtils.withCache(
      cacheKey,
      () => MusicController.handleGetMusicInfo(url),
      { ttl: CacheTTL.ONE_DAY }
    )

    return ResponseBuilder.success(data)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/music/getMusicInfo')
  }
})
