import { AnimeController } from '@anime/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'

import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const metadata = await AnimeController.handleGetAnimeMetadata(url)

      return ResponseBuilder.success(metadata)
    } catch (error) {
      return ResponseBuilder.fromError(
        error,
        'GET /api/animes/getAnimeMetadatas'
      )
    }
  })
)
