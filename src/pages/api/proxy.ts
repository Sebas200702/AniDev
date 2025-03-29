import type { APIRoute } from 'astro'
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

    const mimeType = format === 'avif' ? 'image/avif' : 'image/webp'
    return new Response(optimizedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
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
