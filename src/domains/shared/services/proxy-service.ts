import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'
import { ImageRepository } from '@shared/repositories/image-repository'
import sharp from 'sharp'

const logger = createContextLogger('ProxyService')

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
        throw AppError.tooLarge('Image too large', { maxBytes: MAX_SIZE })
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
      logger.error('[ProxyService.optimizeImage] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.externalApi('Failed to optimize image', {
        originalError: error,
      })
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
        throw AppError.validation('Invalid image URL')
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

      if (!response.ok) {
        // If 404 or 403, return placeholder instead of throwing
        if (response.status === 404 || response.status === 403) {
          logger.warn(
            `[ProxyService] Image not found or forbidden: ${imageUrl} (${response.status})`
          )
          const placeholderBuffer = await ImageRepository.getPlaceholder()
          return this.optimizeImage(placeholderBuffer, width, quality, format)
        }
        throw AppError.externalApi(
          `Failed to fetch image: ${response.statusText}`,
          { status: response.status, url: imageUrl }
        )
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return this.optimizeImage(buffer, width, quality, format)
    } catch (error) {
      clearTimeout(timeoutId)
      logger.error('[ProxyService.fetchAndOptimize] Error:', error)

      // Fallback to placeholder on error
      try {
        const placeholderBuffer = await ImageRepository.getPlaceholder()
        return this.optimizeImage(placeholderBuffer, width, quality, format)
      } catch (fallbackError) {
        logger.error(
          '[ProxyService.fetchAndOptimize] Fallback failed:',
          fallbackError
        )
        // If even placeholder fails, rethrow original error
        if (isAppError(error)) throw error
        throw AppError.externalApi('Failed to fetch image', {
          originalError: error,
        })
      }
    }
  },
}
