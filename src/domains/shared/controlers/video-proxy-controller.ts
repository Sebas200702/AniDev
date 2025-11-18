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
   * Handle video proxy request and prepare response
   */
  async handleProxyRequest(
    url: URL,
    origin: string
  ): Promise<{
    type: 'playlist' | 'stream'
    content?: string
    stream?: ReadableStream<Uint8Array>
    contentType: string
    cacheControl: string
    expires?: string
  }> {
    const { resourceUrl } = this.validateParams(url)
    const result = await VideoProxyService.fetchResource(resourceUrl, origin)

    if (result.type === 'playlist') {
      return {
        type: 'playlist',
        content: result.content,
        contentType: result.contentType,
        cacheControl: 'public, max-age=86400, s-maxage=86400',
        expires: new Date(Date.now() + 86400 * 1000).toUTCString(),
      }
    }

    // Create stream for video
    const stream = new ReadableStream({
      start(controller) {
        const reader = result.stream.getReader()

        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close()
              return
            }
            controller.enqueue(value)
            push()
          })
        }

        push()
      },
    })

    return {
      type: 'stream',
      stream,
      contentType: result.contentType,
      cacheControl: 'public, max-age=86400',
    }
  },
}
