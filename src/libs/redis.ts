import { createClient } from 'redis'

/**
 * Redis connection pool manager for handling multiple concurrent connections.
 *
 * @description This module implements a connection pool pattern to prevent
 * "max number of clients reached" errors when using Redis across multiple
 * endpoints concurrently.
 */

// Define the actual client type that includes all modules
type ExtendedRedisClient = ReturnType<typeof createClient>

interface RedisPoolConfig {
  maxConnections: number
  minConnections: number
  acquireTimeout: number
  idleTimeout: number
}

class RedisConnectionPool {
  private pool: ExtendedRedisClient[] = []
  private availableConnections: ExtendedRedisClient[] = []
  private busyConnections: Set<ExtendedRedisClient> = new Set()
  private connectionLastUsed: Map<ExtendedRedisClient, number> = new Map()
  private config: RedisPoolConfig
  private isShuttingDown = false
  private idleCleanupInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<RedisPoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections ?? 3, // Reducido a 3 para evitar límites
      minConnections: config.minConnections ?? 0, // Sin conexiones mínimas
      acquireTimeout: config.acquireTimeout ?? 5000,
      idleTimeout: config.idleTimeout ?? 30000, // Reducido a 30 segundos
    }

    // Implementar limpieza de conexiones idle
    this.startIdleConnectionCleaner()
  }

  private createRedisClient(): ExtendedRedisClient {
    const client = createClient({
      username: 'default',
      password: import.meta.env.REDIS_PASSWORD,
      socket: {
        host: 'redis-14957.crce181.sa-east-1-2.ec2.redns.redis-cloud.com',
        port: 14957,
        reconnectStrategy: (retries: number) => {
          if (retries > 2) return false // Reducido a 2 intentos
          return Math.min(retries * 1000, 3000)
        },
        connectTimeout: 5000, // Reducido timeout
        keepAlive: 5000,
      },
      pingInterval: 60000, // Ping cada minuto para mantener viva la conexión
    })

    // Manejo de errores por cliente
    client.on('error', (err) => {
      console.error(`Redis Pool Client Error:`, err.message)
      this.removeClientFromPool(client)
    })

    client.on('end', () => {
      this.removeClientFromPool(client)
    })

    return client
  }

  private removeClientFromPool(client: ExtendedRedisClient): void {
    this.pool = this.pool.filter((c) => c !== client)
    this.availableConnections = this.availableConnections.filter(
      (c) => c !== client
    )
    this.busyConnections.delete(client)
    this.connectionLastUsed.delete(client)

    try {
      if (client.isOpen) {
        client.quit().catch(() => {})
      }
    } catch (_error) {}
  }

  private startIdleConnectionCleaner(): void {
    this.idleCleanupInterval = setInterval(() => {
      this.cleanupIdleConnections()
    }, 15000) // Reducido a 15 segundos
  }

  private cleanupIdleConnections(): void {
    if (this.isShuttingDown) return

    const now = Date.now()
    const connectionsToRemove: ExtendedRedisClient[] = []
    if (this.availableConnections.length > this.config.minConnections) {
      for (const client of this.availableConnections) {
        const lastUsed = this.connectionLastUsed.get(client) || now
        const idleTime = now - lastUsed

        if (idleTime > this.config.idleTimeout) {
          connectionsToRemove.push(client)
        }
      }

      const canRemove = Math.max(
        0,
        this.availableConnections.length - this.config.minConnections
      )
      const toRemove = connectionsToRemove.slice(0, canRemove)

      toRemove.forEach((client) => {
        this.removeClientFromPool(client)
      })
    }
  }

  private async initializeMinConnections(): Promise<void> {
    const promises = []
    for (let i = 0; i < this.config.minConnections; i++) {
      promises.push(this.createInitialConnection())
    }
    await Promise.all(promises)
  }

  private async createInitialConnection(): Promise<void> {
    const client = this.createRedisClient()
    try {
      await client.connect()
      this.pool.push(client)
      this.availableConnections.push(client)
    } catch (error) {
      console.error('Failed to create initial Redis connection:', error)
      throw error
    }
  }

  private async createAndConnectClient(): Promise<ExtendedRedisClient> {
    const client = this.createRedisClient()
    try {
      await client.connect()
      this.pool.push(client)

      return client
    } catch (error) {
      console.error('Failed to create Redis connection:', error)
      throw error
    }
  }

  async acquireConnection(): Promise<ExtendedRedisClient> {
    if (this.isShuttingDown) {
      throw new Error('Connection pool is shutting down')
    }

    if (this.availableConnections.length > 0) {
      const client = this.availableConnections.pop()!
      this.busyConnections.add(client)

      if (!client.isReady) {
        try {
          if (!client.isOpen) await client.connect()
        } catch (_error) {
          this.removeClientFromPool(client)
          return this.acquireConnection()
        }
      }

      return client
    }

    if (this.pool.length < this.config.maxConnections) {
      try {
        const client = await this.createAndConnectClient()
        this.busyConnections.add(client)
        const index = this.availableConnections.indexOf(client)
        if (index > -1) {
          this.availableConnections.splice(index, 1)
        }
        return client
      } catch (error) {
        console.error('Failed to create new connection:', error)
      }
    }

    return this.waitForAvailableConnection()
  }

  private async waitForAvailableConnection(): Promise<ExtendedRedisClient> {
    const startTime = Date.now()

    while (Date.now() - startTime < this.config.acquireTimeout) {
      if (this.availableConnections.length > 0) {
        return this.acquireConnection()
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    throw new Error(
      `Timeout acquiring Redis connection after ${this.config.acquireTimeout}ms`
    )
  }

  releaseConnection(client: ExtendedRedisClient): void {
    if (!this.busyConnections.has(client)) {
      return
    }

    this.busyConnections.delete(client)
    this.connectionLastUsed.set(client, Date.now())

    // Si tenemos muchas conexiones disponibles, cerrar esta en lugar de mantenerla
    if (
      this.availableConnections.length >= 2 ||
      this.pool.length > this.config.minConnections
    ) {
      this.removeClientFromPool(client)
      return
    }

    if (client.isReady && !this.isShuttingDown) {
      this.availableConnections.push(client)
    } else {
      this.removeClientFromPool(client)
    }
  }

  async initialize(): Promise<void> {
    try {
      await this.initializeMinConnections()
    } catch (error) {
      console.error('Failed to initialize Redis pool:', error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true

    if (this.idleCleanupInterval) {
      clearInterval(this.idleCleanupInterval)
      this.idleCleanupInterval = null
    }

    const shutdownPromises = this.pool.map(async (client) => {
      try {
        if (client.isOpen) {
          await client.quit()
        }
      } catch (error) {
        console.error('Error closing Redis client:', error)
      }
    })

    await Promise.allSettled(shutdownPromises)

    this.pool = []
    this.availableConnections = []
    this.busyConnections.clear()
    this.connectionLastUsed.clear()
  }

  getStats() {
    return {
      total: this.pool.length,
      available: this.availableConnections.length,
      busy: this.busyConnections.size,
      maxConnections: this.config.maxConnections,
    }
  }
}
declare global {
  var __redisPool: RedisConnectionPool | undefined
}

const redisPool =
  global.__redisPool ??
  new RedisConnectionPool({
    maxConnections: 3, // Reducido significativamente
    minConnections: 0, // Sin mínimo
    acquireTimeout: 5000,
    idleTimeout: 30000, // Cerrar conexiones idle después de 30s
  })

if (!global.__redisPool) {
  global.__redisPool = redisPool

  redisPool.initialize().catch(console.error)

  const gracefulShutdown = async () => {
    await redisPool.shutdown()
  }

  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('beforeExit', gracefulShutdown)
}

/**
 * Executes a Redis operation using connection pooling.
 *
 * @param operation - Function that receives a Redis client and returns a Promise
 * @returns Promise with the operation result or null if failed
 */
export async function executeRedisOperation<T>(
  operation: (client: ExtendedRedisClient) => Promise<T>
): Promise<T | null> {
  let client: ExtendedRedisClient | null = null

  try {
    client = await redisPool.acquireConnection()
    return await operation(client)
  } catch (error: any) {
    console.error('Redis operation failed:', error.message)

    if (error.message.includes('max number of clients reached')) {
      console.error(
        'Redis: Max clients reached. Pool stats:',
        redisPool.getStats()
      )
    }

    return null
  } finally {
    if (client) {
      redisPool.releaseConnection(client)
    }
  }
}

/**
 * Legacy functions for backward compatibility
 * Maintains exact same API but now uses connection pooling internally
 */
export async function safeRedisOperation<T>(
  operation: (client: ExtendedRedisClient) => Promise<T>
): Promise<T | null> {
  return executeRedisOperation(operation)
}

/**
 * Optimized version for multiple Redis operations in sequence
 * Use this when you need to do multiple Redis calls in the same endpoint
 */
export async function batchRedisOperations<T>(
  operations: ((client: ExtendedRedisClient) => Promise<T>)[]
): Promise<(T | null)[]> {
  const result = await executeRedisOperation(async (client) => {
    const results: (T | null)[] = []
    for (const operation of operations) {
      try {
        results.push(await operation(client))
      } catch (error) {
        console.error('Batch operation failed:', error)
        results.push(null)
      }
    }
    return results
  })

  return result ?? []
}

export async function ensureRedisConnection(): Promise<boolean> {
  try {
    const result = await executeRedisOperation(async (client) => {
      return await client.ping()
    })
    return result === 'PONG'
  } catch {
    return false
  }
}

export async function connectRedis(): Promise<void> {
  const success = await ensureRedisConnection()
  if (!success) {
    throw new Error('Failed to establish Redis connection')
  }
}

export function getRedisPoolStats() {
  return redisPool.getStats()
}

export { redisPool }

export type RedisClientType = ExtendedRedisClient
