import { VideoProxyService } from '@shared/services/video-proxy-service'

/**
 * Video Proxy Controller
 *
 * @description
 * Controller layer for video proxy endpoints.
 */
export const VideoProxyController = {
  /**
   * Validate video proxy parameters
   */
  validateParams(url: URL) {
    const resourceUrl = url.searchParams.get('url')

    if (!resourceUrl) {
      throw new Error('Missing resource URL')
    }

    return { resourceUrl }
  },

  /**
   * Handle video proxy request
   */
  async handleProxy(url: URL, origin: string) {
    const { resourceUrl } = this.validateParams(url)
    return await VideoProxyService.fetchResource(resourceUrl, origin)
  },
}
