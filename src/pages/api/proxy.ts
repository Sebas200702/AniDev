import type { APIRoute } from 'astro'
import sharp from 'sharp'

export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get('url')
  const width = parseInt(url.searchParams.get('w') ?? '0')
  const quality = parseInt(url.searchParams.get('q') ?? '50')
  const format = url.searchParams.get('format') ?? 'webp'

  if (!imageUrl) {
    return new Response('Missing url', { status: 400 })
  }

  try {
    // Descarga la imagen original
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: 500 })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Optimiza la imagen usando Sharp
    let image = sharp(buffer)

    if (width > 0) {
      image = image.resize({ width })
    }

    // Aplica el formato adecuado (WebP por defecto, AVIF si se solicita)
    if (format === 'avif') {
      image = image.avif({ quality })
    } else {
      image = image.webp({ quality })
    }

    const optimizedBuffer = await image.toBuffer()

    // Determina el tipo MIME según el formato
    const mimeType = format === 'avif' ? 'image/avif' : 'image/webp'

    return new Response(optimizedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response('Error processing image', { status: 500 })
  }
}
