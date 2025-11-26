import { CharacterController } from '@character/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const data = await CharacterController.handleGetAnimeCharacters(url)
      return ResponseBuilder.success(data)
    } catch (error) {
      return ResponseBuilder.fromError(
        error,
        'GET /api/characters/getAnimeCharacters'
      )
    }
  })
)
