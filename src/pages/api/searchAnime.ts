import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
    const query = url.searchParams.get('query')
    

    return new Response(JSON.stringify({query}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
}
