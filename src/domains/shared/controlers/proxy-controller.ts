import { ProxyService } from '@shared/services/proxy-service'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { imageProxyDeduplicator } from '@utils/request-deduplicator'

/**
 * Proxy Controller
 *
 * @description
 * Controller layer for image proxy endpoints.
 */
export const ProxyController = {
  /**
   * Validate and parse proxy parameters
   */
  validateParams(url: URL): {
    imageUrl: string
    width: number
    quality: number
    format: 'webp' | 'avif'
  } {
    const imageUrl = url.searchParams.get('url')

    if (!imageUrl) {
      throw new Error('Missing image URL')
    }

    if (imageUrl.startsWith('blob:')) {
      throw new Error(
        'blob: URLs are not fetchable on the server. Use POST /api/proxy with the Blob as the request body.'
      )
    }

    const width = Number.parseInt(url.searchParams.get('w') ?? '0', 10)
    const quality = Math.min(
      Math.max(Number.parseInt(url.searchParams.get('q') ?? '50', 10), 1),
      100
    )
    const format =
      url.searchParams.get('format') === 'avif'
        ? ('avif' as const)
        : ('webp' as const)

    return { imageUrl, width, quality, format }
  },

  /**
   * Handle proxy request with caching and timeout
   */
  async handleProxyRequest(
    url: URL
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const { imageUrl, width, quality, format } = this.validateParams(url)

    // Generate cache key
    const cacheKey = CacheUtils.generateKey(
      'img-proxy',
      `${imageUrl}:${width}:${quality}:${format}`
    )

    // Add timeout wrapper (20s to give margin before Vercel timeout)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Proxy timeout')), 20000)
    )

    // Deduplicate concurrent requests for the same image
    // This prevents multiple Redis operations for identical images
    const resultPromise = imageProxyDeduplicator.deduplicate(
      cacheKey,
      async () => {
        // Try to get from cache or fetch with timeout
        return await CacheUtils.withBufferCache(
          cacheKey,
          async () => {
            return await ProxyService.fetchAndOptimize(
              imageUrl,
              width > 0 ? width : undefined,
              quality,
              format
            )
          },
          { ttl: CacheTTL.SIX_HOURS } // Reducido de 1 día a 6 horas para operaciones más rápidas
        )
      }
    )

    const result = await Promise.race([resultPromise, timeoutPromise])

    // Validate result
    if (!result) {
      throw new Error('No result from proxy operation')
    }

    if (!result.buffer || !Buffer.isBuffer(result.buffer)) {
      throw new Error('Invalid buffer in proxy result')
    }

    if (result.buffer.length === 0) {
      throw new Error('Empty buffer in proxy result')
    }

    if (!result.mimeType) {
      throw new Error('Missing mimeType in proxy result')
    }

    return result
  },
}
