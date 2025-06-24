// src/middleware/redisConnection.ts
import type { APIContext, APIRoute } from 'astro'
import { redis } from '@libs/redis'

/**
 * Middleware que asegura que sólo haya
 * UNA conexión Redis por proceso.
 */
export const redisConnection = (handler: APIRoute) => {
  return async (context: APIContext): Promise<Response> => {
    try {
      // Conecta sólo si no está ya listo
      if (!redis.isReady) {
        await redis.connect()
      }
    } catch (err) {
      console.error('Error conectando a Redis:', err)
      // Opcional: devolver 503 mientras Redis no esté disponible
      return new Response(
        JSON.stringify({ error: 'Servicio de cache no disponible' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Llamamos al handler original
    return handler(context)
  }
}
