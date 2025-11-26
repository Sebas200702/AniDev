import { createClient } from 'redis'

import { createContextLogger } from '@libs/pino'
const logger = createContextLogger('RedisClient')

export type RedisClient = ReturnType<typeof createClient>

let redisClient: RedisClient | null = null
let isConnecting = false

/**
 * Get or create the singleton Redis client
 */
export async function getRedisClient(): Promise<RedisClient> {
  if (redisClient?.isReady) {
    return redisClient
  }

  if (isConnecting) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return getRedisClient()
  }

  isConnecting = true

  try {
    if (!redisClient) {
      redisClient = createClient({
        username: 'default',
        password: import.meta.env.REDIS_PASSWORD,
        socket: {
          host: 'redis-14957.crce181.sa-east-1-2.ec2.redns.redis-cloud.com',
          port: 14957,
          connectTimeout: 10000,
        },
      })

      redisClient.on('error', (err) => {
        console.error('Redis client error:', err.message)
      })
    }

    if (!redisClient.isOpen) {
      await redisClient.connect()
      logger.info('✅ Redis connected')
    }

    return redisClient
  } finally {
    isConnecting = false
  }
}

/**
 * Graceful shutdown
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient?.isOpen) {
    await redisClient.quit()
    redisClient = null
    logger.info('🛑 Redis disconnected')
  }
}

/**
 * Ensure Redis connection is ready
 */
export async function ensureRedisConnection(): Promise<boolean> {
  try {
    const client = await getRedisClient()
    const result = await client.ping()
    return result === 'PONG'
  } catch (error) {
    console.error('Failed to ensure Redis connection:', error)
    return false
  }
}

// Graceful shutdown handlers
if (typeof process !== 'undefined') {
  process.on('SIGINT', disconnectRedis)
  process.on('SIGTERM', disconnectRedis)
  process.on('beforeExit', disconnectRedis)
}
