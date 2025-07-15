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
 * - Connection pooling and cleanup
 *
 * The module includes:
 * - A configured Redis client singleton instance
 * - Error event handler for client errors
 * - Connection management functions
 * - Automatic cleanup on process termination
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
    reconnectStrategy: (retries: number) => {
      // Estrategia de reconexión más conservadora
      if (retries > 5) {
        console.error('Redis: Too many reconnection attempts, giving up')
        return false
      }
      const delay = Math.min(retries * 1000, 5000) // Max 5 segundos
      console.log(`Redis: Reconnecting in ${delay}ms (attempt ${retries})`)
      return delay
    },
    connectTimeout: 10000, // 10 segundos timeout para conexión
    lazyConnect: true, // No conectar automáticamente al crear el cliente
  },
}

export const redis: RedisClientType =
  global.__redisClient ?? createClient(DEFAULT_REDIS_URL)

if (!global.__redisClient) {
  global.__redisClient = redis

  redis.on('error', (err) => {
    console.error('Redis Client Error:', err.message)
    // No terminar el proceso por errores de Redis
    if (err.message.includes('max number of clients reached')) {
      console.error(
        'Redis: Max clients reached. Consider implementing connection pooling.'
      )
    }
  })

  redis.on('connect', () => {
    console.log('Redis: Connection established')
  })

  redis.on('ready', () => {
    console.log('Redis: Client ready to execute commands')
  })

  redis.on('reconnecting', () => {
    console.log('Redis: Attempting to reconnect...')
  })

  redis.on('end', () => {
    console.log('Redis: Connection ended')
  })

  // Cleanup automático al terminar el proceso
  const gracefulShutdown = async () => {
    try {
      if (redis.isOpen) {
        console.log('Redis: Graceful shutdown initiated')
        await redis.quit()
        console.log('Redis: Connection closed gracefully')
      }
    } catch (error) {
      console.error('Redis: Error during graceful shutdown:', error)
    }
  }

  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('beforeExit', gracefulShutdown)
}

/**
 * Ensures Redis connection is established and ready.
 *
 * @description This function manages Redis connection state with improved error handling
 * and connection management. It prevents connection leaks and handles max client errors.
 *
 * @returns {Promise<boolean>} True if connection is ready, false otherwise
 */
export async function ensureRedisConnection(): Promise<boolean> {
  try {
    // Si ya está listo, no hacer nada
    if (redis.isReady) {
      return true
    }

    // Si no está conectado, intentar conectar
    if (!redis.isOpen) {
      console.log('Redis: Establishing new connection...')
      await redis.connect()
    }

    // Esperar a que esté listo con timeout más corto
    const timeout = 3000 // 3 segundos
    const startTime = Date.now()

    while (!redis.isReady && Date.now() - startTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    if (redis.isReady) {
      return true
    } else {
      console.warn('Redis: Connection timeout after 3 seconds')
      return false
    }
  } catch (error: any) {
    console.error('Redis: Connection error:', error.message)

    // Manejar específicamente el error de max clients
    if (error.message.includes('max number of clients reached')) {
      console.error('Redis: Max clients reached. Attempting to recover...')
      try {
        // Intentar cerrar conexiones existentes
        if (redis.isOpen) {
          await redis.disconnect()
        }
        // Esperar un momento antes de reintentar
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return false
      } catch (cleanupError) {
        console.error('Redis: Cleanup failed:', cleanupError)
        return false
      }
    }

    return false
  }
}

/**
 * Safely executes a Redis operation with connection management.
 *
 * @description Wrapper function that ensures Redis connection before executing operations
 * and handles errors gracefully without crashing the application.
 *
 * @param operation - Redis operation to execute
 * @returns Promise with operation result or null if failed
 */
export async function safeRedisOperation<T>(
  operation: (client: RedisClientType) => Promise<T>
): Promise<T | null> {
  try {
    const isConnected = await ensureRedisConnection()

    if (!isConnected) {
      console.warn('Redis: Operation skipped - connection not available')
      return null
    }

    return await operation(redis)
  } catch (error: any) {
    console.error('Redis: Operation failed:', error.message)
    return null
  }
}

/**
 * Legacy connectRedis function for backward compatibility.
 *
 * @deprecated Use ensureRedisConnection() instead
 */
export async function connectRedis(): Promise<void> {
  const success = await ensureRedisConnection()
  if (!success) {
    throw new Error('Failed to establish Redis connection')
  }
}
