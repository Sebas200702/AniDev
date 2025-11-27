import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { MusicController } from '@music/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const response = await MusicController.handleSearch(url)
      return ResponseBuilder.success(response)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/music')
    }
  })
)
