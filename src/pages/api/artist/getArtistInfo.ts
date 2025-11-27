import { ArtistController } from '@artist/controllers'
import { redisConnection } from '@middlewares/redis-connection'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const data = await ArtistController.handleGetArtistInfo(url)

    return ResponseBuilder.success(data)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/artist/getArtistInfo')
  }
})
