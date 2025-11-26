import { ImageService } from '@shared/services/image-service'

/**
 * Upload Controller
 *
 * @description
 * Controller layer for image upload endpoints.
 */
export const UploadController = {
  /**
   * Validate and handle image upload
   */
  async handleUpload(request: Request) {
    const body = await request.json()
    const { image, filename, isBanner } = body

    if (!image) {
      throw new Error('Missing image data')
    }

    const url = new URL(request.url)
    const requestUrl = url.origin

    return await ImageService.uploadImage(
      image,
      filename,
      isBanner === true,
      requestUrl
    )
  },
}
