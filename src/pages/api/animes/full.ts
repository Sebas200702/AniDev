import { AnimeController } from '@anime/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'


export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
         const data = await AnimeController.handleGetAnimesFull(url)
      return ResponseBuilder.success(
        { data },
        {
          headers: {
            'Cache-Control': 'public, max-age=7200, s-maxage=7200',
            Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
            Vary: 'Accept-Encoding',
          },
        }
      )
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/animes/full')
    }
  })
)
