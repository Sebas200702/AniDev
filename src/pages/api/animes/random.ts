import { AnimeController } from '@anime/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const result = await AnimeController.handleGetRandomAnime(url)
    return ResponseBuilder.success(result)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/animes/random')
  }
})
