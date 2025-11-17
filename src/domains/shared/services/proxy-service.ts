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
      let sharpInstance = sharp(buffer)

      if (width && width > 0) {
        sharpInstance = sharpInstance.resize({ width })
      }

      const optimizedBuffer = await sharpInstance
        .toFormat(format, { quality })
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

      // Fetch image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Optimize
      return this.optimizeImage(buffer, width, quality, format)
    } catch (error) {
      console.error('[ProxyService.fetchAndOptimize] Error:', error)
      throw error
    }
  },
}
