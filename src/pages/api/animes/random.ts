import { rateLimit } from '@middlewares/rate-limit'

import { getRandomAnime } from '@utils/get-random-anime'
import type { APIRoute } from 'astro'
export const GET: APIRoute = rateLimit(async ({ url }) => {
  const parentalControl =
    url.searchParams.get('parental_control') === 'false' ? false : true
  try {
    const result = await getRandomAnime(parentalControl)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
