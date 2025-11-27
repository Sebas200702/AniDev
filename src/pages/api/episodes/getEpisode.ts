import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'

import { ResponseBuilder } from '@utils/response-builder'
import { EpisodeController } from '@watch/controllers'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const episode = await EpisodeController.handleGetEpisode(url)

      return ResponseBuilder.success(episode)
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/episodes/getEpisode')
    }
  })
)
