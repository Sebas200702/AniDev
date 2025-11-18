import { DownloadController } from '@download/controlers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url, request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: DownloadController.getCorsHeaders(),
    })
  }

  try {
    const result = await DownloadController.handleDownloadRequest(url)

    const headers: Record<string, string> = {
      'Content-Type': result.contentType,
      'Content-Length': result.buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ...result.corsHeaders,
    }

    if (result.forceDownload) {
      headers['Content-Disposition'] =
        `attachment; filename="${result.filename}"`
    }

    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    // Handle large files with streaming
    if (error?.message === 'LARGE_FILE') {
      try {
        const streamResult = await DownloadController.handleStreamDownload(url)

        const headers: Record<string, string> = {
          'Content-Type': streamResult.contentType,
          'Cache-Control': 'public, max-age=3600',
          ...streamResult.corsHeaders,
        }

        if (streamResult.contentLength) {
          headers['Content-Length'] = streamResult.contentLength
        }

        if (streamResult.forceDownload) {
          headers['Content-Disposition'] =
            `attachment; filename="${streamResult.filename}"`
        }

        return new Response(streamResult.body, { status: 200, headers })
      } catch (streamError) {
        return ResponseBuilder.fromError(streamError, 'GET /api/download')
      }
    }

    return ResponseBuilder.fromError(error, 'GET /api/download')
  }
}
