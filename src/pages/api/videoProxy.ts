import { rateLimit } from '@middlewares/rate-limit'
import { VideoProxyController } from '@shared/controlers/video-proxy-controller'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async ({ url, request }) => {
  try {
    const rangeHeader = request.headers.get('Range')

    const result = await VideoProxyController.handleProxyRequest(
      url,
      url.origin,
      rangeHeader
    )

    const headers: Record<string, string> = {
      'Content-Type': result.contentType,
      'Cache-Control': result.cacheControl,
      'Accept-Ranges': result.acceptRanges ?? 'bytes',
    }

    if (result.expires) {
      headers.Expires = result.expires
    }

    if (result.contentLength) {
      headers['Content-Length'] = result.contentLength
    }

    if (result.contentRange) {
      headers['Content-Range'] = result.contentRange
    }

    if (result.type === 'playlist') {
      return new Response(result.content, { status: result.status, headers })
    }

    return new Response(result.stream, { status: result.status, headers })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/videoProxy')
  }
})
