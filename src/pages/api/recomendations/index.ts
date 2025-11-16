import type { APIRoute } from 'astro'
import { recommendationsController } from '@recomendations/controlers'
import { redisConnection } from '@middlewares/redis-connection'

export const GET: APIRoute = redisConnection(async ({ request }) => {

  return await recommendationsController.getRecommendations(request)
})
