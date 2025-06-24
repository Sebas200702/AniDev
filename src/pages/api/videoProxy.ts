import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * videoProxy endpoint handles video streaming and HLS playlist processing.
 *
 * @summary
 * An API endpoint that proxies video content and processes HLS playlists for streaming.
 *
 * @description
 * This endpoint acts as a proxy for video content, handling both direct video streams
 * and HLS (HTTP Live Streaming) playlists. It implements rate limiting to prevent
 * abuse and includes proper error handling for various streaming scenarios. The endpoint
 * processes .m3u8 playlists to ensure proper segment URL handling and implements
 * streaming for video content using ReadableStream.
 *
 * The endpoint supports:
 * - Direct video streaming with proper content type handling
 * - HLS playlist processing with segment URL rewriting
 * - Rate limiting for abuse prevention
 * - Streaming optimization with proper headers
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - HLS support: Processes and modifies .m3u8 playlists
 * - Streaming: Efficient video streaming using ReadableStream
 * - Content type handling: Proper MIME type handling
 * - Error handling: Comprehensive error handling
 * - Caching: Long-term caching for playlists
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {Request} context.request - The HTTP request object
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('url') - The URL of the video resource
 * @returns {Promise<Response>} A Response object containing the video stream or error message
 *
 * @example
 * // Request for video stream
 * GET /api/videoProxy?url=https://example.com/video.mp4
 *
 * // Request for HLS playlist
 * GET /api/videoProxy?url=https://example.com/playlist.m3u8
 *
 * // Success Response (200)
 * // Returns video stream or processed playlist
 *
 * // Error Response (400)
 * "Missing resource URL"
 */

export const GET: APIRoute = rateLimit(async ({ request, url }) => {
  const resourceUrl = url.searchParams.get('url')

  if (!resourceUrl) {
    return new Response('Missing resource URL', { status: 400 })
  }

  try {
    const response = await fetch(resourceUrl)

    if (!response.ok) {
      return new Response('Error fetching the resource', {
        status: response.status,
      })
    }

    if (resourceUrl.endsWith('.m3u8')) {
      const originalText = await response.text()

      const modifiedText = originalText.replace(
        /(^(?!https?:\/\/)[^\s#]+\.ts)/gm,
        (match) =>
          `${url.origin}/api/videoProxy?url=${encodeURIComponent(resourceUrl.replace(/[^/]+$/, '') + match)}`
      )

      return new Response(modifiedText, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          Expires: new Date(Date.now() + 86400 * 1000).toUTCString(),
        },
      })
    }

    const contentType =
      response.headers.get('Content-Type') ?? 'application/octet-stream'
    const readableStream = response.body

    if (readableStream) {
      const stream = new ReadableStream({
        start(controller) {
          const reader = readableStream.getReader()

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

      return new Response(stream, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          Expires: new Date(Date.now() + 86400 * 1000).toUTCString(),
        },
      })
    }

    return new Response('No content', { status: 204 })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})
