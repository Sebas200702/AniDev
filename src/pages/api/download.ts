import { DownloadController } from '@download/controlers'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import type { APIRoute } from 'astro'

const getCorsHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': '*',
  'Access-Control-Max-Age': '86400',
})

export const GET: APIRoute = redisConnection(async ({ url, request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: getCorsHeaders(),
    })
  }

  try {
    const { fileUrl, customFilename, forceDownload } =
      DownloadController.validateParams(url)

    const cacheKey = CacheUtils.generateKey('download', fileUrl)

    const cachedData = await CacheUtils.get<{
      data: string
      contentType: string
      filename: string
      forceDownload: boolean
    }>(cacheKey)

    if (cachedData) {
      const buffer = Buffer.from(cachedData.data, 'base64')

      const headers: Record<string, string> = {
        'Content-Type': cachedData.contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: `"${cacheKey}"`,
        ...getCorsHeaders(),
      }

      if (forceDownload || cachedData.forceDownload) {
        const filename = customFilename || cachedData.filename
        headers['Content-Disposition'] = `attachment; filename="${filename}"`
      }

      return new Response(buffer, { status: 200, headers })
    }

    // Check if file should be streamed (large files)
    const result = await DownloadController.handleDownload(
      fileUrl,
      customFilename
    )

    if (result.isLarge) {
      // Stream large files without caching
      const streamResult = await DownloadController.handleStreamDownload(
        fileUrl,
        customFilename
      )

      const headers: Record<string, string> = {
        'Content-Type': streamResult.contentType,
        'Cache-Control': 'public, max-age=3600',
        ...getCorsHeaders(),
      }

      if (streamResult.contentLength) {
        headers['Content-Length'] = streamResult.contentLength
      }

      if (forceDownload) {
        headers['Content-Disposition'] =
          `attachment; filename="${streamResult.filename}"`
      }

      return new Response(streamResult.body, { status: 200, headers })
    }

    // Cache small files
    const buffer = Buffer.from(result.buffer)
    const cacheData = {
      data: buffer.toString('base64'),
      contentType: result.contentType,
      filename: result.filename,
      forceDownload,
    }

    await CacheUtils.set(cacheKey, cacheData, { ttl: CacheTTL.ONE_WEEK })

    const headers: Record<string, string> = {
      'Content-Type': result.contentType,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: `"${cacheKey}"`,
      ...getCorsHeaders(),
    }

    if (forceDownload) {
      headers['Content-Disposition'] =
        `attachment; filename="${result.filename}"`
    }

    return new Response(buffer, { status: 200, headers })
  } catch (error) {
    console.error('[Download API] Error:', error)

    const message = error instanceof Error ? error.message : 'Download failed'
    const corsHeaders = getCorsHeaders()

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  }
})
