import { safeRedisOperation } from '@libs/redis'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

/**
 * Optimized file download proxy endpoint for bypassing CORS restrictions with improved performance.
 *
 * @summary
 * High-performance API endpoint that fetches files from external URLs and serves them
 * with complete CORS bypass and optimized streaming for fast downloads.
 *
 * @description
 * This endpoint provides a fast, reliable file proxy service with complete CORS bypass,
 * optimized caching, and streaming support for large files. It includes comprehensive
 * security measures and error handling while maintaining high performance.
 *
 * @features
 * - Complete CORS bypass with comprehensive headers
 * - Streaming support for large files (no memory issues)
 * - Optimized caching with smart cache keys
 * - Fast response times with minimal overhead
 * - Security validation with reasonable restrictions
 * - Proper download headers and filename handling
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('url') - The source file URL
 * @param {string} [context.url.searchParams.get('filename')] - Custom filename for download
 * @param {string} [context.url.searchParams.get('download')] - Force download (true/false)
 * @returns {Promise<Response>} A Response object containing the file or error message
 */

// Reasonable security restrictions (only block obvious internal networks)
const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\.0\.0\.1$/,
  /^0\.0\.0\.0$/,
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
]

// Increase file size limit to 100MB for better user experience
const MAX_FILE_SIZE = 100 * 1024 * 1024

/**
 * Fast URL validation with minimal checks
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)

    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }

    // Quick hostname check
    const hostname = url.hostname.toLowerCase()
    return !BLOCKED_PATTERNS.some((pattern) => pattern.test(hostname))
  } catch {
    return false
  }
}

/**
 * Comprehensive CORS headers for complete bypass
 */
function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Max-Age': '86400',
  }
}

/**
 * Get MIME type from file extension (simplified)
 */
function getMimeType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase() || ''

  const types: Record<string, string> = {
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    json: 'application/json',

    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',

    // Audio/Video
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    webm: 'video/webm',

    // Archives
    zip: 'application/zip',
    rar: 'application/vnd.rar',
  }

  return types[ext] || 'application/octet-stream'
}

export const GET: APIRoute = redisConnection(async ({ url, request }) => {
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: getCorsHeaders(),
    })
  }

  const fileUrl = url.searchParams.get('url')
  const customFilename = url.searchParams.get('filename')
  const forceDownload = url.searchParams.get('download') === 'true'

  if (!fileUrl) {
    return new Response(JSON.stringify({ error: 'Missing "url" parameter' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(),
      },
    })
  }

  if (!isValidUrl(fileUrl)) {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(),
      },
    })
  }

  try {
    // Optimized cache key
    const cacheKey = `dl:${Buffer.from(fileUrl).toString('base64').slice(0, 50)}`

    // Check cache first
    const cachedData = await safeRedisOperation((client) =>
      client.get(cacheKey)
    )

    if (cachedData) {
      const cached = JSON.parse(cachedData)
      const buffer = Buffer.from(cached.data, 'base64')

      const headers: Record<string, string> = {
        'Content-Type': cached.contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: `"${cacheKey}"`,
        ...getCorsHeaders(),
      }

      if (forceDownload || cached.forceDownload) {
        const filename = customFilename || cached.filename || 'download'
        headers['Content-Disposition'] = `attachment; filename="${filename}"`
      }

      return new Response(buffer, { status: 200, headers })
    }

    // Fetch file with optimized headers
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch file: ${response.status}` }),
        {
          status: response.status >= 400 && response.status < 500 ? 400 : 502,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(),
          },
        }
      )
    }

    // Check file size
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large (max 100MB)' }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(),
          },
        }
      )
    }

    // Get content type and filename
    const contentType =
      response.headers.get('content-type') || getMimeType(fileUrl)

    let filename = customFilename
    if (!filename) {
      const contentDisposition = response.headers.get('content-disposition')
      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i
        )
        if (match) {
          filename = match[1].replace(/['"]/g, '')
        }
      }
      if (!filename) {
        filename = fileUrl.split('/').pop()?.split('?')[0] || 'download'
      }
    }

    // Stream the response for large files (>10MB)
    const isLargeFile =
      contentLength && parseInt(contentLength) > 10 * 1024 * 1024

    if (isLargeFile) {
      // Stream large files directly without caching
      const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        ...getCorsHeaders(),
      }

      if (contentLength) {
        headers['Content-Length'] = contentLength
      }

      if (forceDownload) {
        headers['Content-Disposition'] = `attachment; filename="${filename}"`
      }

      // Return streaming response
      return new Response(response.body, { status: 200, headers })
    }

    // For smaller files, cache them
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large (max 100MB)' }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(),
          },
        }
      )
    }

    // Cache small files for 1 year
    const cacheData = {
      data: buffer.toString('base64'),
      contentType,
      filename,
      forceDownload,
    }

    // Cache in background (don't wait)
    safeRedisOperation((client) =>
      client.set(cacheKey, JSON.stringify(cacheData), { EX: 31536000 })
    ).catch(() => {}) // Ignore cache errors

    // Return response immediately
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: `"${cacheKey}"`,
      ...getCorsHeaders(),
    }

    if (forceDownload) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`
    }

    return new Response(buffer, { status: 200, headers })
  } catch (error) {
    console.error('Download error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Download failed',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(),
        },
      }
    )
  }
})
