import { createClient } from 'redis'

import { createContextLogger } from '@libs/pino'
const logger = createContextLogger('RedisClient')

export type RedisClient = ReturnType<typeof createClient>

let redisClient: RedisClient | null = null
let connectPromise: Promise<RedisClient> | null = null

/**
 * Get or create the singleton Redis client.
 *
 * Redis is an optional dependency: if it is unreachable this resolves to a
 * client whose `isReady` is `false` instead of throwing, so callers can
 * degrade gracefully and never crash a request because of Redis.
 */
export async function getRedisClient(): Promise<RedisClient> {
  if (redisClient?.isReady) {
    return redisClient
  }

  if (connectPromise) {
    return connectPromise
  }

  const redisPassword = import.meta.env.REDIS_PASSWORD
  const client: RedisClient = createClient({
    ...(redisPassword ? { username: 'default', password: redisPassword } : {}),
    socket: {
      host: import.meta.env.REDIS_HOST || '127.0.0.1',
      port: Number(import.meta.env.REDIS_PORT) || 6379,
      connectTimeout: 3000,
      reconnectStrategy: (retries) => {
        // Cap reconnection attempts so an unreachable Redis does not hold
        // the event loop open or spam the logs forever.
        if (retries > 5) {
          return new Error('Redis reconnect limit exceeded')
        }
        return Math.min(500 * retries, 3000)
      },
    },
  })

  client.on('error', (err) => {
    if (
      err instanceof Error &&
      /ECONNREFUSED|ENOTFOUND|EAI_AGAIN/.test(err.message)
    ) {
      logger.debug('Redis unavailable, continuing without cache:', err.message)
    } else {
      logger.warn('Redis client error:', err.message)
    }
  })

  redisClient = client

  connectPromise = client
    .connect()
    .then(() => {
      logger.info('✅ Redis connected')
      return client
    })
    .catch((err: Error) => {
      // Do not throw: let callers fall back gracefully. Keep the client
      // reference so `isReady` reports the real state, but reset the
      // connection promise so the next call can retry.
      logger.warn(
        'Redis connection failed, continuing without cache:',
        err?.message || err
      )
      redisClient = null
      return client
    })
    .finally(() => {
      connectPromise = null
    })

  return connectPromise
}

/**
 * Graceful shutdown
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient?.isOpen) {
      await redisClient.quit()
    }
  } catch (error) {
    logger.warn('Redis shutdown error:', error)
  } finally {
    redisClient?.removeAllListeners()
    redisClient = null
    connectPromise = null
  }
}

/**
 * Ensure Redis connection is ready
 */
export async function ensureRedisConnection(): Promise<boolean> {
  try {
    const client = await getRedisClient()
    if (!client.isReady) {
      return false
    }
    const result = await client.ping()
    return result === 'PONG'
  } catch (error) {
    logger.debug('Redis unavailable:', error)
    return false
  }
}

// Graceful shutdown handlers
if (typeof process !== 'undefined') {
  process.on('SIGINT', disconnectRedis)
  process.on('SIGTERM', disconnectRedis)
  process.on('beforeExit', disconnectRedis)
}
