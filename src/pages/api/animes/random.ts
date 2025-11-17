import { AnimeService } from '@anime/services'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const parentalControl = url.searchParams.get('parental_control') !== 'false'
    const userId = url.searchParams.get('user_id')

    const result = await AnimeService.getRandomAnime(userId, parentalControl)

    if (!result) {
      return ResponseBuilder.notFound('No se encontró un anime aleatorio.')
    }

    return ResponseBuilder.success(result)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/animes/random')
  }
})
