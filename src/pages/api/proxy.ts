import { ProxyController } from '@shared/controlers/proxy-controller'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  try {
    const result = await ProxyController.handleProxyRequest(url)

    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Length': result.buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/proxy')
  }
}
