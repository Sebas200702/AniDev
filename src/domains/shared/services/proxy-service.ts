import { ImageRepository } from '@shared/repositories/image-repository'
import sharp from 'sharp'

export const ProxyService = {
  /**
   * Process and optimize image for proxy
   */
  async optimizeImage(
    buffer: Buffer,
    width?: number,
    quality: number = 50,
    format: 'webp' | 'avif' = 'webp'
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      // Limit buffer size to prevent memory issues (10MB max)
      const MAX_SIZE = 10 * 1024 * 1024
      if (buffer.length > MAX_SIZE) {
        throw new Error('Image too large')
      }

      let sharpInstance = sharp(buffer, {
        limitInputPixels: 268402689, // ~16k x 16k max
        sequentialRead: true,
      })

      if (width && width > 0) {
        sharpInstance = sharpInstance.resize({
          width,
          withoutEnlargement: true,
        })
      }

      const optimizedBuffer = await sharpInstance
        .toFormat(format, { quality, effort: 3 })
        .toBuffer()

      const mimeType = format === 'avif' ? 'image/avif' : 'image/webp'

      return {
        buffer: optimizedBuffer,
        mimeType,
      }
    } catch (error) {
      console.error('[ProxyService.optimizeImage] Error:', error)
      throw error
    }
  },

  /**
   * Fetch and process image
   */
  async fetchAndOptimize(
    imageUrl: string,
    width?: number,
    quality: number = 50,
    format: 'webp' | 'avif' = 'webp'
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      // Handle MyAnimeList icon
      const malIcon =
        'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
      if (imageUrl === malIcon) {
        const placeholderBuffer = await ImageRepository.getPlaceholder()
        return this.optimizeImage(placeholderBuffer, width, quality, format)
      }

      // Fetch image with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      try {
        const response = await fetch(imageUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AniDevBot/1.0)',
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`)
        }

        // Check content length before downloading
        const contentLength = response.headers.get('content-length')
        if (
          contentLength &&
          Number.parseInt(contentLength) > 10 * 1024 * 1024
        ) {
          throw new Error('Image too large')
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Optimize
        return this.optimizeImage(buffer, width, quality, format)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Image fetch timeout')
        }
        throw fetchError
      }
    } catch (error) {
      console.error('[ProxyService.fetchAndOptimize] Error:', error)
      throw error
    }
  },
}
