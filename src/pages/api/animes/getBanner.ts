import { AnimeController } from '@anime/controlers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  try {
    const data = await AnimeController.handleGetAnimeBanner(url)
    return ResponseBuilder.success({ data })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/animes/getBanner')
  }
}
