import { redisConnection } from '@middlewares/redis-connection'
import { MusicController } from '@music/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const data = await MusicController.handleGetAnimeMusic(url)

    return ResponseBuilder.success(data)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/music/getAnimeMusic')
  }
})
