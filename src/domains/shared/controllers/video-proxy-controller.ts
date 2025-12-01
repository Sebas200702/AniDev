import { createContextLogger } from '@libs/pino'
import { VideoProxyService } from '@shared/services/video-proxy-service'

const logger = createContextLogger('VideoProxyController')

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
    origin: string,
    rangeHeader?: string | null
  ): Promise<{
    type: 'playlist' | 'stream'
    content?: string
    stream?: ReadableStream<Uint8Array>
    contentType: string
    cacheControl: string
    expires?: string
    status: number
    contentLength?: string | null
    contentRange?: string | null
    acceptRanges?: string
  }> {
    const { resourceUrl } = this.validateParams(url)
    const result = await VideoProxyService.fetchResource(
      resourceUrl,
      origin,
      rangeHeader
    )

    if (result.type === 'playlist') {
      return {
        type: 'playlist',
        content: result.content,
        contentType: result.contentType,
        cacheControl: 'public, max-age=86400, s-maxage=86400',
        expires: new Date(Date.now() + 86400 * 1000).toUTCString(),
        status: result.status,
        contentLength: result.headers['Content-Length'],
      }
    }

    // Create stream for video
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

    const stream = new ReadableStream({
      async start(controller) {
        reader = result.stream.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            controller.enqueue(value)
          }
        } catch (error) {
          controller.error(error)
        } finally {
          reader.releaseLock()
          reader = null
        }
      },
      async cancel(reason) {
        // Cleanup when stream is cancelled
        try {
          if (reader) {
            await reader.cancel(reason)
            reader.releaseLock()
            reader = null
          }
        } catch (error) {
          logger.warn('[VideoProxyController] Cancel error:', error)
        }
      },
    })

    return {
      type: 'stream',
      stream,
      contentType: result.contentType,
      cacheControl: 'public, max-age=86400',
      status: result.status,
      contentLength: result.headers['Content-Length'],
      contentRange: result.headers['Content-Range'],
      acceptRanges: result.headers['Accept-Ranges'],
    }
  },
}
