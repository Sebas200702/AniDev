import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
import { createContextLogger } from '@libs/pino'
import { AppError } from '@shared/errors'
import { ProxyService } from '@shared/services/proxy-service'
import { imageProxyDeduplicator } from '@utils/request-deduplicator'
import { getCachedOrFetch } from '@cache/utils'

const logger = createContextLogger('ProxyController')

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
      throw AppError.validation('Missing image URL', { url: url.toString() })
    }

    if (imageUrl.startsWith('blob:')) {
      throw AppError.validation(
        'blob: URLs are not fetchable on the server. Use POST /api/proxy with the Blob as the request body.',
        { imageUrl }
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

    const cacheParams = { imageUrl, width, quality, format }

    const cacheKey = CacheService.generateKey('img-proxy', cacheParams)

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Proxy timeout')), 20000)
    )

    const resultPromise = imageProxyDeduplicator.deduplicate(
      cacheKey,
      async () => {
        const cached = await CacheService.get<{
          buffer: { type: 'Buffer'; data: number[] }
          mimeType: string
        }>(cacheKey)
        if (cached) {
          // Handle different buffer serialization formats
          let bufferData: any = cached.buffer
          if (
            bufferData &&
            typeof bufferData === 'object' &&
            bufferData.type === 'Buffer' &&
            Array.isArray(bufferData.data)
          ) {
            bufferData = bufferData.data
          }

          if (bufferData) {
            return {
              buffer: Buffer.from(bufferData),
              mimeType: cached.mimeType,
            }
          }
          // If buffer data is missing/invalid, treat as cache miss
          logger.warn(
            `[ProxyController] Invalid cached buffer for key: ${cacheKey}`
          )
        }

        const result = await ProxyService.fetchAndOptimize(
          imageUrl,
          width > 0 ? width : undefined,
          quality,
          format
        )

        return getCachedOrFetch(cacheKey, async () => result, {
          ttl: TtlValues.DAY,
        })
      }
    )

    const result = await Promise.race([resultPromise, timeoutPromise])

    if (!result) {
      throw AppError.invalidState('No result from proxy operation', {
        cacheKey,
      })
    }

    if (!result.buffer || !Buffer.isBuffer(result.buffer)) {
      throw AppError.invalidState('Invalid buffer in proxy result', {
        hasBuffer: !!result.buffer,
        isBuffer: result.buffer ? Buffer.isBuffer(result.buffer) : false,
      })
    }

    if (result.buffer.length === 0) {
      throw AppError.invalidState('Empty buffer in proxy result', { cacheKey })
    }

    if (!result.mimeType) {
      throw AppError.invalidState('Missing mimeType in proxy result', {
        cacheKey,
      })
    }

    return result
  },
}
