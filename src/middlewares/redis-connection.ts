import { ensureRedisConnection } from '@libs/redis'
// src/middleware/redisConnection.ts
import type { APIContext, APIRoute } from 'astro'

/**
 * Middleware que gestiona conexiones Redis de forma segura.
 *
 * @description Middleware mejorado que maneja conexiones Redis con mejor
 * gestión de errores, prevención de conexiones múltiples y recuperación
 * automática de errores de "max clients reached".
 */
export const redisConnection = (handler: APIRoute) => {
  return async (context: APIContext): Promise<Response> => {
    try {
      // Intentar asegurar la conexión Redis
      const isConnected = await ensureRedisConnection()

      if (!isConnected) {
        console.warn(
          'Redis: Connection not available, proceeding without cache'
        )
        // Continuar sin Redis - la aplicación debe funcionar sin cache
      }
    } catch (err: any) {
      console.error('Redis middleware error:', err.message)

      // Manejar específicamente errores de max clients
      if (err.message.includes('max number of clients reached')) {
        console.error(
          'Redis: Max clients error in middleware, proceeding without cache'
        )
      }

      // No lanzar error para evitar que la API falle completamente
      // Las APIs individuales pueden verificar si Redis está disponible
    }

    return handler(context)
  }
}
