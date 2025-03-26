import type { APIRoute } from 'astro'
import { redis } from '@libs/redis'
import sharp from 'sharp'

export const GET: APIRoute = async ({ url }) => {
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
    if (!redis.isOpen) {
      await redis.connect()
    }

    const cachedData = await redis.get(`proxy:${url.searchParams}`)
    if (cachedData) {
      return new Response(cachedData, {
        status: 200,
        headers: { 'Content-Type': 'image/webp' },
      })
    }

    const response = await fetch(imageUrl)

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Invalid image URL' }), {
        status: 400,
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

    if (!optimizedBuffer) {
      return new Response(JSON.stringify({ error: 'Error processing image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await redis.set(`proxy:${url.searchParams}`, optimizedBuffer, {
      EX: 3600,
    })
    return new Response(optimizedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=600, s-maxage=3600',
        'CDN-Cache-Control': 'max-age=3600',
        Vary: 'Accept-Encoding',
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
