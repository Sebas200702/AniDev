import { redisConnection } from '@middlewares/redis-connection'
import { recommendationsController } from '@recommendations/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ request, cookies }) => {
  try {
    const recommendations = await recommendationsController.getRecommendations(
      request,
      cookies
    )

    return ResponseBuilder.success(recommendations)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/recommendations')
  }
})
