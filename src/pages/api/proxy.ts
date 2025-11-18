import { redisConnection } from '@middlewares/redis-connection'
import { ProxyController } from '@shared/controlers/proxy-controller'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const { imageUrl, width, quality, format } =
      ProxyController.validateParams(url)
    const cacheKey = CacheUtils.generateKey(
      'img-proxy',
      `${imageUrl}:${width}:${quality}:${format}`
    )

    const result = await CacheUtils.withCache(
      cacheKey,
      () => ProxyController.handleProxy(url),
      { ttl: CacheTTL.ONE_DAY }
    )

    if (!result?.buffer) {
      throw new Error('Invalid proxy result')
    }

    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Length': result.buffer?.length?.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/proxy')
  }
})
