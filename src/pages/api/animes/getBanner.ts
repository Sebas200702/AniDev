import { AnimeService } from '@anime/services'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  try {
    const animeId = Number.parseInt(url.searchParams.get('anime_id') ?? '')
    const limitCount = Number.parseInt(
      url.searchParams.get('limit_count') ?? '8'
    )

    if (!animeId || Number.isNaN(animeId)) {
      return ResponseBuilder.validationError('anime_id is required')
    }

    const data = await AnimeService.getAnimeBanner(animeId, limitCount)
    return ResponseBuilder.success({ data })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/getBanner')
  }
}
