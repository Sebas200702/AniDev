import { redis } from '@libs/redis'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

/**
 * File download proxy endpoint for bypassing CORS restrictions.
 *
 * @summary
 * An API endpoint that fetches files from external URLs and serves them,
 * bypassing CORS restrictions and providing secure file access.
 *
 * @description
 * This endpoint acts as a file proxy service that fetches files from external URLs
 * and serves them to the client, effectively bypassing CORS restrictions that would
 * otherwise prevent direct access from the browser. It supports all file types and
 * includes comprehensive error handling, input validation, and security measures.
 *
 * The endpoint implements proper caching strategies to improve performance and
 * reduce bandwidth usage. It validates input URLs and content types, and includes
 * security measures to prevent abuse and ensure safe file access.
 *
 * @features
 * - CORS bypass: Access files from any domain without CORS restrictions
 * - Universal support: Handle any file type (documents, images, videos, etc.)
 * - Input validation: URL validation and security checks
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Caching: Browser and CDN caching with configurable TTL
 * - Security: URL validation and content-type detection
 * - Download support: Proper headers for file downloads
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('url') - The source file URL
 * @param {string} [context.url.searchParams.get('filename')] - Custom filename for download
 * @param {string} [context.url.searchParams.get('download')] - Force download (true/false)
 * @param {string} [context.url.searchParams.get('cache')] - Cache duration in seconds
 * @returns {Promise<Response>} A Response object containing the file or error message
 *
 * @example
 * // Basic file access
 * GET /api/download?url=https://example.com/document.pdf
 *
 * // Force download with custom filename
 * GET /api/download?url=https://example.com/file.zip&download=true&filename=my-file.zip
 *
 * // Custom cache duration (1 hour)
 * GET /api/download?url=https://example.com/data.json&cache=3600
 *
 * // Success Response (200)
 * // Returns the file with appropriate headers
 *
 * // Error Response (400)
 * {
 *   "error": "Missing 'url' parameter"
 * }
 */

// Security: List of blocked domains/patterns for security
const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '10.',
  '172.',
  '192.168.',
  'internal',
  'private',
]

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024

/**
 * Validates if a URL is safe to access
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }

    // Check against blocked domains
    const hostname = url.hostname.toLowerCase()
    return !BLOCKED_DOMAINS.some(
      (blocked) => hostname.includes(blocked) || hostname.startsWith(blocked)
    )
  } catch {
    return false
  }
}

/**
 * Gets the appropriate MIME type based on file extension
 */
function getMimeTypeFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',

    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',

    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',

    // Video
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',

    // Archives
    zip: 'application/zip',
    rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',

    // Other
    js: 'application/javascript',
    css: 'text/css',
    html: 'text/html',
    htm: 'text/html',
  }

  return mimeTypes[extension || ''] || 'application/octet-stream'
}

export const GET: APIRoute = redisConnection(async ({ url }) => {
  const fileUrl = url.searchParams.get('url')
  const customFilename = url.searchParams.get('filename')
  const forceDownload = url.searchParams.get('download') === 'true'
  const cacheSeconds = parseInt(url.searchParams.get('cache') ?? '86400', 10) // Default 24 hours

  if (!fileUrl) {
    return new Response(JSON.stringify({ error: 'Missing "url" parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!isValidUrl(fileUrl)) {
    return new Response(JSON.stringify({ error: 'Invalid or blocked URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const cacheKey = `download-${Buffer.from(fileUrl).toString('base64')}`

    const cachedData = await redis.get(cacheKey)
    if (cachedData) {
      const cached = JSON.parse(cachedData)
      const buffer = Buffer.from(cached.data, 'base64')

      const headers: Record<string, string> = {
        'Content-Type': cached.contentType,
        'Content-Length': buffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }

      if (forceDownload || cached.forceDownload) {
        const filename = customFilename || cached.filename || 'download'
        headers['Content-Disposition'] = `attachment; filename="${filename}"`
      }

      return new Response(buffer, {
        status: 200,
        headers,
      })
    }

    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DownloadProxy/1.0)',
      },
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch file: ${response.status} ${response.statusText}`,
        }),
        {
          status: response.status >= 400 && response.status < 500 ? 400 : 502,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large (max 50MB)' }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    let contentType =
      response.headers.get('content-type') || getMimeTypeFromUrl(fileUrl)

    let filename = customFilename
    if (!filename) {
      const contentDisposition = response.headers.get('content-disposition')
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        )
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      if (!filename) {
        filename = fileUrl.split('/').pop() || 'download'
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large (max 50MB)' }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const cacheData = {
      data: buffer.toString('base64'),
      contentType,
      filename,
      forceDownload,
    }

    await redis.set(cacheKey, JSON.stringify(cacheData), { EX: cacheSeconds })

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`,
      Expires: new Date(Date.now() + cacheSeconds * 1000).toUTCString(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (forceDownload) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`
    }

    return new Response(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error processing file:', error)

    let errorMessage = 'Error processing file'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'Failed to fetch file from source'
        statusCode = 502
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout'
        statusCode = 504
      }
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
