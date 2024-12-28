import type { APIRoute } from 'astro'
import sharp from 'sharp'
import { redis } from '@libs/redis'

export const GET: APIRoute = async ({ url }) => {
  if (!redis.isOpen) {
    await redis.connect()
  }
  const cachedData = await redis.get(url.toString())

  if (cachedData) {
    return new Response(cachedData, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
  const imageUrl = url.searchParams.get('url')
  const width = parseInt(url.searchParams.get('w') ?? '0', 10)
  const quality = Math.min(
    Math.max(parseInt(url.searchParams.get('q') ?? '50', 10), 1),
    100
  )
  const format = url.searchParams.get('format') === 'avif' ? 'avif' : 'webp'

  if (!imageUrl) {
    return new Response(JSON.stringify({ error: 'Missing "url" parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.error(`Failed to fetch image from URL: ${imageUrl}`)
      return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
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

    const mimeType = format === 'avif' ? 'image/avif' : 'image/webp'

    await redis.set(url.toString(), optimizedBuffer, { EX: 3600 })

    return new Response(optimizedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': optimizedBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(JSON.stringify({ error: 'Error processing image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
