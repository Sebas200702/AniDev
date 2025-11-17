import { rateLimit } from '@middlewares/rate-limit'
import { VideoProxyController } from '@shared/controlers/video-proxy-controller'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const result = await VideoProxyController.handleProxy(url, url.origin)

    if (result.type === 'playlist') {
      return new Response(result.content, {
        status: 200,
        headers: {
          'Content-Type': result.contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          Expires: new Date(Date.now() + 86400 * 1000).toUTCString(),
        },
      })
    }

    // Stream
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

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/videoProxy')
  }
})
