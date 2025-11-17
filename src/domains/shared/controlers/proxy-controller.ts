import { ProxyService } from '@shared/services/proxy-service'

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
   * Handle proxy request
   */
  async handleProxy(url: URL) {
    const { imageUrl, width, quality, format } = this.validateParams(url)

    return await ProxyService.fetchAndOptimize(
      imageUrl,
      width > 0 ? width : undefined,
      quality,
      format
    )
  },
}
