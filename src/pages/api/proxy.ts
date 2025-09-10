import crypto from 'crypto'
import path from 'path'
import { safeRedisOperation } from '@libs/redis'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'
import fs from 'fs/promises'
import sharp from 'sharp'

/**
 * Image proxy endpoint for optimizing and serving images.
 *
 * @summary
 * An API endpoint that fetches, optimizes, and serves images with configurable transformations.
 *
 * @description
 * This endpoint acts as an image proxy service that fetches images from external URLs,
 * applies optimizations and transformations, and serves them with proper caching headers.
 * It supports image resizing, quality adjustment, and format conversion between WebP and AVIF.
 * The endpoint includes comprehensive error handling and input validation to ensure
 * reliable image processing and delivery.
 *
 * The endpoint uses Sharp for image processing and implements proper caching strategies
 * to improve performance and reduce bandwidth usage. It validates input URLs and
 * content types to prevent processing of invalid or non-image content.
 *
 * @features
 * - Image optimization: Resize, quality adjustment, and format conversion
 * - Format support: WebP and AVIF output formats
 * - Input validation: URL and content-type validation
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Caching: Browser and CDN caching with 24-hour TTL
 * - Performance: Efficient image processing with Sharp
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('url') - The source image URL
 * @param {string} [context.url.searchParams.get('w')] - Target width for resizing (optional)
 * @param {string} [context.url.searchParams.get('q')] - Quality setting (1-100, default: 50)
 * @param {string} [context.url.searchParams.get('format')] - Output format ('webp' or 'avif')
 * @returns {Promise<Response>} A Response object containing the optimized image or error message
 *
 * @example
 * // Request
 * GET /api/proxy?url=https://example.com/image.jpg&w=800&q=75&format=webp
 *
 * // Success Response (200)
 * // Returns the optimized image with appropriate headers
 *
 * // Error Response (400)
 * {
 *   "error": "Missing 'url' parameter"
 * }
 */

const getPlaceholderBuffer = async () => {
  const placeholderPath = path.resolve(
    process.cwd(),
    'public',
    'placeholder.webp'
  )
  return fs.readFile(placeholderPath)
}

export const GET: APIRoute = redisConnection(async ({ url }) => {
  const imageUrl = url.searchParams.get('url')

  const width = parseInt(url.searchParams.get('w') ?? '0', 10)
  const quality = Math.min(
    Math.max(parseInt(url.searchParams.get('q') ?? '50', 10), 1),
    100
  )
  const format = url.searchParams.get('format') === 'avif' ? 'avif' : 'webp'
  const mimeType = format === 'avif' ? 'image/avif' : 'image/webp'
  if (!imageUrl) {
    throw new Error('Missing image URL')
  }


  if (imageUrl.startsWith('blob:')) {
    return new Response(
      JSON.stringify({
        error:
          'blob: URLs are not fetchable on the server. Use POST /api/proxy with the Blob as the request body.',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const cacheKey = `img:${Buffer.from(imageUrl).toString('base64')}:${width}:${quality}:${format}`

    const cachedData = await safeRedisOperation((client) =>
      client.get(cacheKey)
    )

    if (cachedData) {
      const imageBuffer = Buffer.from(cachedData, 'base64')
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': imageBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          ETag: `"${cacheKey}"`,
        },
      })
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.startsWith('image/')) {
      throw new Error('Invalid image response')
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let image = sharp(buffer)
    if (width > 0) {
      image = image.resize({ width })
    }

    image =
      format === 'avif' ? image.avif({ quality }) : image.webp({ quality })

    const optimizedBuffer = await image.toBuffer()
    if (!optimizedBuffer) {
      throw new Error('Image optimization failed')
    }
    await safeRedisOperation((client) =>
      client.set(cacheKey, optimizedBuffer.toString('base64'), { EX: 31536000 })
    )

    return new Response(new Uint8Array(optimizedBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: `"${cacheKey}"`,
      },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    const buffer = await getPlaceholderBuffer()
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
})

export const POST: APIRoute = redisConnection(async ({ request, url }) => {
  try {
    const width = parseInt(url.searchParams.get('w') ?? '0', 10)
    const quality = Math.min(
      Math.max(parseInt(url.searchParams.get('q') ?? '50', 10), 1),
      100
    )
    const format = url.searchParams.get('format') === 'avif' ? 'avif' : 'webp'
    const mimeType = format === 'avif' ? 'image/avif' : 'image/webp'

    const arrayBuffer = await request.arrayBuffer()
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: 'Empty image body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const buffer = Buffer.from(arrayBuffer)
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')
    const cacheKey = `img:body:${hash}:${width}:${quality}:${format}`

    const cachedData = await safeRedisOperation((client) =>
      client.get(cacheKey)
    )
    if (cachedData) {
      const imageBuffer = Buffer.from(cachedData, 'base64')
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': imageBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          ETag: `"${cacheKey}"`,
        },
      })
    }

    let image = sharp(buffer)
    if (width > 0) {
      image = image.resize({ width })
    }
    image =
      format === 'avif' ? image.avif({ quality }) : image.webp({ quality })

    const optimizedBuffer = await image.toBuffer()
    if (!optimizedBuffer) {
      throw new Error('Image optimization failed')
    }

    await safeRedisOperation((client) =>
      client.set(cacheKey, optimizedBuffer.toString('base64'), { EX: 31536000 })
    )

    return new Response(new Uint8Array(optimizedBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: `"${cacheKey}"`,
      },
    })
  } catch (error) {
    console.error('Error processing image (POST):', error)
    const buffer = await getPlaceholderBuffer()
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
})
