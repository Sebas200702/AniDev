import { type RedisClientType, createClient } from 'redis'

/**
 * Redis client instance for caching and session management.
 *
 * @description This module initializes and exports a Redis client instance configured
 * with connection details for a Redis Cloud instance. The client is used throughout
 * the application for caching, rate limiting, and session management.
 *
 * The client is configured with:
 * - Username and password for authentication
 * - Redis Cloud host and port
 * - Error handling for connection issues
 *
 * The module includes:
 * - A configured Redis client singleton instance
 * - Error event handler for client errors
 * - connectRedis function to establish Redis connection
 */

declare global {
  // Extend NodeJS.Global to include __redisClient
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined
}

const DEFAULT_REDIS_URL = {
  username: 'default',
  password: import.meta.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-14957.crce181.sa-east-1-2.ec2.redns.redis-cloud.com',
    port: 14957,
  },
}

export const redis: RedisClientType =
  global.__redisClient ?? createClient(DEFAULT_REDIS_URL)

if (!global.__redisClient) {
  global.__redisClient = redis
  redis.on('error', (err) => {
    console.error('Redis Client Error', err)
  })
}

/**
 * Establishes connection to the Redis server.
 *
 * @description This function attempts to connect to the Redis server using the configured
 * client singleton. It includes proper error handling and logging for both successful
 * connections and connection failures.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established
 * or rejects if the connection fails
 */
export async function connectRedis(): Promise<void> {
  try {
    // Verificar si Redis no está conectado Y no está en proceso de conexión
    if (!redis.isOpen && !redis.isReady) {
      await redis.connect()
      console.log('Connected to Redis successfully')
    }
    // Si está abierto pero no listo, esperar a que esté listo
    else if (redis.isOpen && !redis.isReady) {
      console.log('Redis socket open, waiting for ready state...')
      // Esperar hasta que esté listo (máximo 5 segundos)
      const timeout = 5000
      const startTime = Date.now()
      while (!redis.isReady && Date.now() - startTime < timeout) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      if (redis.isReady) {
        console.log('Redis is now ready')
      } else {
        console.warn('Redis connection timeout - connection may be unstable')
      }
    } else if (redis.isReady) {
      console.log('Redis already connected and ready')
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    throw error
  }
}
