import type { APIRoute } from 'astro'
import { AnimeService } from '@anime/services'
import { rateLimit } from '@middlewares/rate-limit'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  const parentalControl =
    url.searchParams.get('parental_control') !== 'false'

  const userId = url.searchParams.get('user_id')

  try {
    const result = await AnimeService.getRandomAnime(userId, parentalControl)

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'No se encontró un anime aleatorio.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (_error) {
    console.error(_error)
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
