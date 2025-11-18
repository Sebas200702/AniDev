import { rateLimit } from '@middlewares/rate-limit'
import { VideoProxyController } from '@shared/controlers/video-proxy-controller'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const result = await VideoProxyController.handleProxyRequest(
      url,
      url.origin
    )

    const headers: Record<string, string> = {
      'Content-Type': result.contentType,
      'Cache-Control': result.cacheControl,
    }

    if (result.expires) {
      headers.Expires = result.expires
    }

    if (result.type === 'playlist') {
      return new Response(result.content, { status: 200, headers })
    }

    return new Response(result.stream, { status: 200, headers })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/videoProxy')
  }
})
