import type { APIRoute } from 'astro'
import { redisConnection } from '@middlewares/redis-connection'
import { recommendationsController } from '@recomendations/controlers'

export const GET: APIRoute = redisConnection(async ({ request }) => {
  // Delegar todo al controlador
  return await recommendationsController.getRecommendations(request)
})
