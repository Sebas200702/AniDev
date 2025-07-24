import { safeRedisOperation } from '@libs/redis'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'
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
    return new Response(JSON.stringify({ error: 'Missing "url" parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Optimized cache key
    const cacheKey = `img:${Buffer.from(imageUrl).toString('base64')}:${width}:${quality}:${format}`

    const cachedData = await safeRedisOperation((client) =>
      client.get(cacheKey)
    )

    if (cachedData) {
      // Direct base64 decode - much faster than JSON parsing
      const imageBuffer = Buffer.from(cachedData, 'base64')
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': imageBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
          ETag: `"${cacheKey}"`,
        },
      })
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Invalid image URL (response not ok)' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'URL does not point to a valid image' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
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
      return new Response(
        JSON.stringify({ error: 'Error processing image (empty buffer)' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Store as base64 - much more efficient than JSON for binary data
    await safeRedisOperation((client) =>
      client.set(
        cacheKey,
        optimizedBuffer.toString('base64'),
        { EX: 31536000 } // 1 year
      )
    )

    return new Response(optimizedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
        ETag: `"${cacheKey}"`,
      },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(JSON.stringify({ error: 'Error processing image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
