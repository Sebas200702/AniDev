import { redisConnection } from '@middlewares/redis-connection'
import { recommendationsController } from '@recomendations/controlers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ request }) => {
  try {

    const recommendations =
      await recommendationsController.getRecommendations(request)

    return ResponseBuilder.success(recommendations)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/recomendations')
  }
})
