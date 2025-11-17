import { redisConnection } from '@middlewares/redis-connection'
import { recommendationsController } from '@recomendations/controlers'
import { parseCookies } from '@recomendations/utils/parse-cookies'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ request }) => {
  try {
    const url = new URL(request.url)
    const cookies = parseCookies(request)

    const userInfo = await getSessionUserInfo({
      request,
      accessToken: cookies['sb-access-token'],
      refreshToken: cookies['sb-refresh-token'],
    })

    const cacheKey = CacheUtils.generateKey(
      'recommendations',
      `${userInfo?.id ?? 'guest'}:${url.searchParams.toString()}`
    )

    const recommendations = await CacheUtils.withCache(
      cacheKey,
      () => recommendationsController.getRecommendations(request),
      { ttl: CacheTTL.ONE_HOUR }
    )

    return ResponseBuilder.success(recommendations)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/recomendations')
  }
})
