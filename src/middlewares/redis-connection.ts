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
      // Verificar si Redis no está conectado Y no está en proceso de conexión
      if (!redis.isOpen && !redis.isReady) {
        await redis.connect()
      }
      // Si está abierto pero no listo, esperar a que esté listo
      else if (redis.isOpen && !redis.isReady) {
        // Esperar hasta que esté listo (máximo 5 segundos)
        const timeout = 5000
        const startTime = Date.now()
        while (!redis.isReady && Date.now() - startTime < timeout) {
          await new Promise((resolve) => setTimeout(resolve, 10))
        }
        if (!redis.isReady) {
          console.warn('Redis connection timeout - proceeding anyway')
        }
      }
    } catch (err) {
      console.error('Error conectando a Redis:', err)
      // No lanzar el error para evitar que la API falle
      // El handler puede manejar el caso donde Redis no esté disponible
    }
    return handler(context)
  }
}
