import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'
import { ImageRepository } from '@shared/repositories/image-repository'
import sharp from 'sharp'
const logger = createContextLogger('ImageService')
export const ImageService = {
  /**
   * Process and optimize image
   */
  async processImage(
    buffer: Buffer,
    mimeType: string,
    isBanner: boolean = false
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      const isSupported = ImageRepository.isValidFormat(mimeType)
      const isGif = mimeType === 'image/gif'

      // Don't process GIFs or unsupported formats
      if (isGif || !isSupported) {
        return { buffer, mimeType: isGif ? 'image/gif' : 'image/webp' }
      }

      // Optimize based on type
      const optimizedBuffer = isBanner
        ? await sharp(buffer)
            .resize({ width: 1920 })
            .webp({ quality: 100 })
            .toBuffer()
        : await sharp(buffer)
            .resize({ width: 240 })
            .webp({ quality: 100 })
            .toBuffer()

      return {
        buffer: optimizedBuffer,
        mimeType: 'image/webp',
      }
    } catch (error) {
      console.warn(
        '[ImageService.processImage] Processing failed, using original:',
        error
      )
      return { buffer, mimeType: 'image/webp' }
    }
  },

  /**
   * Upload image to IPFS
   */
  async uploadImage(
    imageData: string,
    filename?: string,
    isBanner: boolean = false,
    requestUrl?: string
  ): Promise<string> {
    try {
      let buffer: Buffer
      let mimeType: string

      // Determine if it's a URL or base64
      if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
        if (!requestUrl) {
          throw AppError.validation(
            'Request URL required for URL-based uploads'
          )
        }
        const result = await ImageRepository.fetchImage(imageData, requestUrl)
        buffer = result.buffer
        mimeType = result.mimeType
      } else {
        const result = ImageRepository.parseBase64(imageData)
        buffer = result.buffer
        mimeType = result.mimeType
      }

      // Validate format
      if (!ImageRepository.isValidFormat(mimeType)) {
        throw AppError.validation('Unsupported image format', { mimeType })
      }

      // Process image
      const processed = await this.processImage(buffer, mimeType, isBanner)

      // Generate filename
      const finalFilename = filename || `image-${Date.now()}.webp`

      // Upload to IPFS
      return await ImageRepository.uploadToIPFS(
        processed.buffer,
        finalFilename,
        processed.mimeType
      )
    } catch (error) {
      logger.error('[ImageService.uploadImage] Error:', error)

      if (isAppError(error)) {
        throw error
      }

      throw AppError.externalApi('Failed to upload image', {
        filename,
        isBanner,
        originalError: error,
      })
    }
  },
}
