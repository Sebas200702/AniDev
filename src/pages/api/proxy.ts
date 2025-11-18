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

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Proxy timeout')), 25000)
    ) // 25s max (Vercel limit is 30s)

    const resultPromise = CacheUtils.withCache(
      cacheKey,
      () => ProxyController.handleProxy(url),
      { ttl: CacheTTL.ONE_DAY }
    )

    const result = (await Promise.race([
      resultPromise,
      timeoutPromise,
    ])) as Awaited<typeof resultPromise>

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
