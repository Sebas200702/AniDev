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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

    try {
      // Handle MyAnimeList icon
      const malIcon =
        'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
      if (imageUrl === malIcon) {
        clearTimeout(timeoutId)
        const placeholderBuffer = await ImageRepository.getPlaceholder()
        return this.optimizeImage(placeholderBuffer, width, quality, format)
      }

      // Validate URL
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('Invalid image URL')
      }

      // Fetch image with proper headers to avoid blocks
      const response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/webp,image/avif,image/apng,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          Referer: 'https://myanimelist.net/',
        },
      })

      clearTimeout(timeoutId)

      // Handle errors with fallback to placeholder
      if (!response.ok) {
        console.error(
          `[ProxyService] Fetch failed: ${response.status} for ${imageUrl}`
        )

        // Use placeholder for errors
        if (response.status >= 400) {
          const placeholderBuffer = await ImageRepository.getPlaceholder()
          return this.optimizeImage(placeholderBuffer, width, quality, format)
        }

        throw new Error(`HTTP ${response.status}`)
      }

      // Validate content type
      const contentType = response.headers.get('content-type')
      if (contentType && !contentType.startsWith('image/')) {
        throw new Error(`Invalid content type: ${contentType}`)
      }

      // Check size before downloading
      const contentLength = response.headers.get('content-length')
      if (contentLength && Number.parseInt(contentLength) > 10 * 1024 * 1024) {
        throw new Error('Image too large')
      }

      const arrayBuffer = await response.arrayBuffer()

      if (arrayBuffer.byteLength === 0) {
        throw new Error('Empty response')
      }

      const buffer = Buffer.from(arrayBuffer)

      // Optimize
      return this.optimizeImage(buffer, width, quality, format)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === 'AbortError') {
        throw new Error('Image fetch timeout')
      }

      console.error('[ProxyService.fetchAndOptimize] Error:', fetchError)
      throw fetchError
    }
  },
}
