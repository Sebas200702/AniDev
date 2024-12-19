import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {

    const imageUrl = url.searchParams.get('url')

    if (!imageUrl) {
      return new Response('Missing url', { status: 400 })
    }

    const response = await fetch(imageUrl)
    const blob = await response.blob()

    return new Response(blob, {
      headers: {
        'Content-Type': blob.type,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  
}
