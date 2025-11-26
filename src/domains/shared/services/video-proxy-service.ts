import { AppError, isAppError } from '@shared/errors'

export const VideoProxyService = {
  /**
   * Fetch and process video resource with Range support
   */
  async fetchResource(
    resourceUrl: string,
    origin: string,
    rangeHeader?: string | null
  ) {
    try {
      const headers: HeadersInit = {}

      // Forward Range header for seeking support
      if (rangeHeader) {
        headers.Range = rangeHeader
      }

      const response = await fetch(resourceUrl, { headers })

      if (!response.ok && response.status !== 206) {
        throw AppError.externalApi('Failed to fetch video resource', {
          resourceUrl,
          status: response.status,
        })
      }

      // Handle HLS playlist
      if (resourceUrl.endsWith('.m3u8')) {
        const originalText = await response.text()
        const modifiedText = this.processM3U8(originalText, resourceUrl, origin)

        return {
          type: 'playlist' as const,
          content: modifiedText,
          contentType: 'application/vnd.apple.mpegurl',
          status: 200,
          headers: {
            'Content-Length': response.headers.get('Content-Length'),
          },
        }
      }

      // Handle video stream
      const contentType =
        response.headers.get('Content-Type') ?? 'application/octet-stream'
      const stream = response.body

      if (!stream) {
        throw AppError.externalApi('No stream available', { resourceUrl })
      }

      return {
        type: 'stream' as const,
        stream,
        contentType,
        status: response.status,
        headers: {
          'Content-Length': response.headers.get('Content-Length'),
          'Content-Range': response.headers.get('Content-Range'),
          'Accept-Ranges': response.headers.get('Accept-Ranges') ?? 'bytes',
        },
      }
    } catch (error) {
      console.error('[VideoProxyService.fetchResource] Error:', error)

      if (isAppError(error)) {
        throw error
      }

      throw AppError.externalApi('Failed to fetch video resource', {
        resourceUrl,
        originalError: error,
      })
    }
  },

  /**
   * Process M3U8 playlist to rewrite segment URLs
   */
  processM3U8(content: string, resourceUrl: string, origin: string): string {
    return content.replaceAll(/(^(?!https?:\/\/)[^\s#]+\.ts)/gm, (match) => {
      const baseUrl = resourceUrl.replace(/[^/]+$/, '')
      return `${origin}/api/videoProxy?url=${encodeURIComponent(baseUrl + match)}`
    })
  },
}
