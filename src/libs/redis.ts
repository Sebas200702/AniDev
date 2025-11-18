import { createClient } from 'redis'

/**
 * Redis connection pool manager for handling multiple concurrent connections.
 *
 * @description This module implements a connection pool pattern to prevent
 * "max number of clients reached" errors when using Redis across multiple
 * endpoints concurrently.
 */

// Define the actual client type that includes all modules
export type ExtendedRedisClient = ReturnType<typeof createClient>

interface RedisPoolConfig {
  maxConnections: number
  minConnections: number
  acquireTimeout: number
  idleTimeout: number
}

class RedisConnectionPool {
  private pool: ExtendedRedisClient[] = []
  private availableConnections: ExtendedRedisClient[] = []
  private readonly busyConnections: Set<ExtendedRedisClient> = new Set()
  private readonly connectionLastUsed: Map<ExtendedRedisClient, number> =
    new Map()
  private readonly connectionAcquiredAt: Map<ExtendedRedisClient, number> =
    new Map()
  private readonly config: RedisPoolConfig
  private isShuttingDown = false
  private idleCleanupInterval: NodeJS.Timeout | null = null
  private stuckConnectionCheckInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<RedisPoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections ?? 10, // Default 10 para manejar proxy de imágenes
      minConnections: config.minConnections ?? 1, // Mantener 1 conexión lista
      acquireTimeout: config.acquireTimeout ?? 15000, // Default 15s
      idleTimeout: config.idleTimeout ?? 120000, // Default 2 minutos
    }

    // Implementar limpieza de conexiones idle
    this.startIdleConnectionCleaner()
    // Monitorear conexiones atascadas
    this.startStuckConnectionMonitor()
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
        keepAlive: true,
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
    this.connectionAcquiredAt.delete(client)

    if (client.isOpen) {
      client.quit().catch(() => {})
    }
  }

  private startIdleConnectionCleaner(): void {
    this.idleCleanupInterval = setInterval(() => {
      this.cleanupIdleConnections()
    }, 15000) // Reducido a 15 segundos
  }

  private startStuckConnectionMonitor(): void {
    this.stuckConnectionCheckInterval = setInterval(() => {
      this.checkForStuckConnections()
    }, 10000) // Check every 10 seconds
  }

  private checkForStuckConnections(): void {
    if (this.isShuttingDown || this.busyConnections.size === 0) return

    const now = Date.now()
    const STUCK_THRESHOLD = 30000 // 30 seconds

    for (const client of this.busyConnections) {
      const acquiredAt = this.connectionAcquiredAt.get(client)
      if (acquiredAt) {
        const heldTime = now - acquiredAt
        if (heldTime > STUCK_THRESHOLD) {
          console.warn(
            `🔴 STUCK CONNECTION DETECTED: Connection held for ${Math.round(heldTime / 1000)}s`,
            {
              poolStats: this.getStats(),
              heldTimeMs: heldTime,
              threshold: STUCK_THRESHOLD,
            }
          )
        }
      }
    }
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

      for (const client of toRemove) {
        this.removeClientFromPool(client)
      }
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

    // Log current pool state for debugging
    const stats = this.getStats()
    if (stats.available === 0 && stats.busy >= stats.maxConnections) {
      console.warn(
        `⚠️  All Redis connections busy: ${stats.busy}/${stats.maxConnections}`
      )
    }

    if (this.availableConnections.length > 0) {
      const client = this.availableConnections.pop()!
      this.busyConnections.add(client)
      this.connectionAcquiredAt.set(client, Date.now())

      if (!client.isReady) {
        try {
          if (!client.isOpen) await client.connect()
        } catch (error) {
          console.error('Error reconnecting Redis client:', error)
          this.removeClientFromPool(client)
          return this.acquireConnection()
        }
      }

      return client
    }

    if (this.pool.length < this.config.maxConnections) {
      try {
        console.log(
          `📝 Creating new Redis connection (${this.pool.length + 1}/${this.config.maxConnections})`
        )
        const client = await this.createAndConnectClient()
        this.busyConnections.add(client)
        this.connectionAcquiredAt.set(client, Date.now())
        const index = this.availableConnections.indexOf(client)
        if (index > -1) {
          this.availableConnections.splice(index, 1)
        }
        return client
      } catch (error) {
        console.error('❌ Failed to create new connection:', error)
      }
    }

    return this.waitForAvailableConnection()
  }

  private async waitForAvailableConnection(): Promise<ExtendedRedisClient> {
    const startTime = Date.now()
    const stats = this.getStats()

    console.warn(
      `⏳ Waiting for Redis connection... Pool stats:`,
      JSON.stringify(stats, null, 2)
    )

    while (Date.now() - startTime < this.config.acquireTimeout) {
      if (this.availableConnections.length > 0) {
        const waitTime = Date.now() - startTime
        console.log(`✅ Connection acquired after ${waitTime}ms`)
        return this.acquireConnection()
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    const finalStats = this.getStats()
    const errorDetails = {
      timeout: this.config.acquireTimeout,
      poolStats: finalStats,
      busyConnectionsCount: this.busyConnections.size,
      availableCount: this.availableConnections.length,
      totalConnections: this.pool.length,
      maxConnections: this.config.maxConnections,
    }

    console.error(
      `❌ Redis Connection Timeout Details:`,
      JSON.stringify(errorDetails, null, 2)
    )

    throw new Error(
      `Timeout acquiring Redis connection after ${this.config.acquireTimeout}ms. ` +
        `Pool stats: ${JSON.stringify(finalStats)}`
    )
  }

  releaseConnection(client: ExtendedRedisClient): void {
    if (!this.busyConnections.has(client)) {
      return
    }

    this.busyConnections.delete(client)
    this.connectionLastUsed.set(client, Date.now())
    this.connectionAcquiredAt.delete(client)

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

    if (this.stuckConnectionCheckInterval) {
      clearInterval(this.stuckConnectionCheckInterval)
      this.stuckConnectionCheckInterval = null
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
    this.connectionAcquiredAt.clear()
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
  interface GlobalThis {
    __redisPool?: RedisConnectionPool
  }
}

const redisPool =
  (globalThis as any).__redisPool ??
  new RedisConnectionPool({
    maxConnections: 10, // Aumentado para proxy de imágenes con alta concurrencia
    minConnections: 2, // Mantener 2 conexiones siempre listas
    acquireTimeout: 15000, // 15s timeout para operaciones lentas
    idleTimeout: 120000, // 2 minutos para evitar crear/destruir conexiones frecuentemente
  })

if (!(globalThis as any).__redisPool) {
  ;(globalThis as any).__redisPool = redisPool

  try {
    await redisPool.initialize()
  } catch (err) {
    console.error(err)
  }
}

const gracefulShutdown = async () => {
  await redisPool.shutdown()
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('beforeExit', gracefulShutdown)

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
  const startTime = Date.now()

  try {
    client = await redisPool.acquireConnection()
    const acquireTime = Date.now() - startTime

    if (acquireTime > 1000) {
      console.warn(`⚠️  Slow Redis connection acquisition: ${acquireTime}ms`)
    }

    // client may have a type that doesn't line up exactly with the operation's expected type;
    // cast to any to satisfy the TypeScript checker while preserving runtime behavior.
    const result = await operation(client as any)
    const totalTime = Date.now() - startTime

    if (totalTime > 2000) {
      console.warn(
        `⚠️  Slow Redis operation completed in ${totalTime}ms (acquire: ${acquireTime}ms, operation: ${totalTime - acquireTime}ms)`
      )
    }

    return result
  } catch (error: any) {
    const totalTime = Date.now() - startTime

    console.error(`❌ Redis operation failed after ${totalTime}ms:`, {
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      poolStats: redisPool.getStats(),
    })

    if (error.message.includes('max number of clients reached')) {
      console.error(
        '🚨 Redis: Max clients reached. Pool stats:',
        redisPool.getStats()
      )
    }

    if (error.message.includes('Timeout acquiring')) {
      console.error(
        '🚨 Redis: Connection timeout. Possible causes:',
        '\n  - Too many concurrent requests',
        '\n  - Slow Redis operations blocking connections',
        '\n  - Network issues',
        '\n  - Consider increasing maxConnections or acquireTimeout'
      )
    }

    return null
  } finally {
    if (client) {
      redisPool.releaseConnection(client)
      const releaseTime = Date.now() - startTime
      if (releaseTime > 3000) {
        console.warn(
          `⚠️  Redis connection held for ${releaseTime}ms before release`
        )
      }
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

/**
 * Logs detailed Redis pool diagnostics
 * Useful for debugging connection issues
 */
export function logRedisPoolDiagnostics() {
  const stats = redisPool.getStats()
  console.log('🔍 Redis Pool Diagnostics:', {
    timestamp: new Date().toISOString(),
    total: stats.total,
    available: stats.available,
    busy: stats.busy,
    maxConnections: stats.maxConnections,
    utilizationPercent: ((stats.busy / stats.maxConnections) * 100).toFixed(1),
    healthStatus:
      stats.available > 0
        ? '✅ Healthy'
        : stats.busy >= stats.maxConnections
          ? '🔴 Saturated'
          : '⚠️  Warning',
  })
}

export { redisPool }
