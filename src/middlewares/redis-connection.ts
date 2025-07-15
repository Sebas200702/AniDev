import { redis } from '@libs/redis'
// src/middleware/redisConnection.ts
import type { APIContext, APIRoute } from 'astro'

/**
 * Middleware que asegura que sólo haya
 * UNA conexión Redis por proceso.
 */
export const redisConnection = (handler: APIRoute) => {
  return async (context: APIContext): Promise<Response> => {
    try {
      if (!redis.isReady) {
        await redis.connect()
      }
    } catch (err) {
      console.error('Error conectando a Redis:', err)
    }
    return handler(context)
  }
}
