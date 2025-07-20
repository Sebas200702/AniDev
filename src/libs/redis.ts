import { type RedisClientType, createClient } from 'redis'

/**
 * Redis connection pool manager for handling multiple concurrent connections.
 * 
 * @description This module implements a connection pool pattern to prevent
 * "max number of clients reached" errors when using Redis across multiple
 * endpoints concurrently.
 */

interface RedisPoolConfig {
  maxConnections: number
  minConnections: number
  acquireTimeout: number
  idleTimeout: number
}

class RedisConnectionPool {
  private pool: RedisClientType[] = []
  private availableConnections: RedisClientType[] = []
  private busyConnections: Set<RedisClientType> = new Set()
  private connectionLastUsed: Map<RedisClientType, number> = new Map()
  private config: RedisPoolConfig
  private isShuttingDown = false
  private idleCleanupInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<RedisPoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections ?? 5, // Más conservador para plan gratuito
      minConnections: config.minConnections ?? 1,
      acquireTimeout: config.acquireTimeout ?? 3000,
      idleTimeout: config.idleTimeout ?? 120000, // 2 minutos
    }
    
    // Implementar limpieza de conexiones idle
    this.startIdleConnectionCleaner()
  }

  private createRedisClient(): RedisClientType {
    const client = createClient({
      username: 'default',
      password: import.meta.env.REDIS_PASSWORD,
      socket: {
        host: 'redis-14957.crce181.sa-east-1-2.ec2.redns.redis-cloud.com',
        port: 14957,
        reconnectStrategy: (retries: number) => {
          if (retries > 3) return false
          return Math.min(retries * 500, 2000)
        },
        connectTimeout: 8000,
        lazyConnect: true,
      },
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

  private removeClientFromPool(client: RedisClientType): void {
    this.pool = this.pool.filter(c => c !== client)
    this.availableConnections = this.availableConnections.filter(c => c !== client)
    this.busyConnections.delete(client)
    this.connectionLastUsed.delete(client)
    
    try {
      if (client.isOpen) {
        client.quit().catch(() => {}) // Cerrar silenciosamente
      }
    } catch (error) {
      // Ignorar errores al cerrar
    }
  }

  private startIdleConnectionCleaner(): void {
    // Limpiar conexiones idle cada minuto
    this.idleCleanupInterval = setInterval(() => {
      this.cleanupIdleConnections()
    }, 60000) // 1 minuto
  }

  private cleanupIdleConnections(): void {
    if (this.isShuttingDown) return

    const now = Date.now()
    const connectionsToRemove: RedisClientType[] = []

    // Solo limpiar si tenemos más que el mínimo
    if (this.availableConnections.length > this.config.minConnections) {
      for (const client of this.availableConnections) {
        const lastUsed = this.connectionLastUsed.get(client) || now
        const idleTime = now - lastUsed

        if (idleTime > this.config.idleTimeout) {
          connectionsToRemove.push(client)
        }
      }

      // Asegurar que no bajemos del mínimo
      const canRemove = Math.max(0, this.availableConnections.length - this.config.minConnections)
      const toRemove = connectionsToRemove.slice(0, canRemove)

      toRemove.forEach(client => {
        console.log('Redis Pool: Removing idle connection')
        this.removeClientFromPool(client)
      })
    }
  }

  private async initializeMinConnections(): Promise<void> {
    const promises = []
    for (let i = 0; i < this.config.minConnections; i++) {
      promises.push(this.createAndConnectClient())
    }
    await Promise.all(promises)
  }

  private async createAndConnectClient(): Promise<RedisClientType> {
    const client = this.createRedisClient()
    try {
      await client.connect()
      this.pool.push(client)
      this.availableConnections.push(client)
      return client
    } catch (error) {
      console.error('Failed to create Redis connection:', error)
      throw error
    }
  }

  async acquireConnection(): Promise<RedisClientType> {
    if (this.isShuttingDown) {
      throw new Error('Connection pool is shutting down')
    }

    // Si hay conexiones disponibles, usar una
    if (this.availableConnections.length > 0) {
      const client = this.availableConnections.pop()!
      this.busyConnections.add(client)
      
      // Verificar si la conexión sigue activa
      if (!client.isReady) {
        try {
          if (!client.isOpen) await client.connect()
        } catch (error) {
          this.removeClientFromPool(client)
          return this.acquireConnection() // Intentar con otra conexión
        }
      }
      
      return client
    }

    // Si no hemos alcanzado el máximo, crear nueva conexión
    if (this.pool.length < this.config.maxConnections) {
      try {
        const client = await this.createAndConnectClient()
        this.busyConnections.add(client)
        return client
      } catch (error) {
        console.error('Failed to create new connection:', error)
      }
    }

    // Esperar por una conexión disponible
    return this.waitForAvailableConnection()
  }

  private async waitForAvailableConnection(): Promise<RedisClientType> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < this.config.acquireTimeout) {
      if (this.availableConnections.length > 0) {
        return this.acquireConnection()
      }
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    throw new Error(`Timeout acquiring Redis connection after ${this.config.acquireTimeout}ms`)
  }

  releaseConnection(client: RedisClientType): void {
    if (!this.busyConnections.has(client)) {
      return // Conexión ya liberada o no válida
    }

    this.busyConnections.delete(client)
    this.connectionLastUsed.set(client, Date.now()) // Marcar último uso
    
    if (client.isReady && !this.isShuttingDown) {
      this.availableConnections.push(client)
    } else {
      this.removeClientFromPool(client)
    }
  }

  async initialize(): Promise<void> {
    try {
      await this.initializeMinConnections()
      console.log(`Redis Pool: Initialized with ${this.config.minConnections} connections`)
    } catch (error) {
      console.error('Failed to initialize Redis pool:', error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true
    
    // Detener limpieza de conexiones idle
    if (this.idleCleanupInterval) {
      clearInterval(this.idleCleanupInterval)
      this.idleCleanupInterval = null
    }
    
    console.log('Redis Pool: Starting graceful shutdown...')

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
    
    console.log('Redis Pool: Shutdown complete')
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

// Singleton del pool de conexiones
declare global {
  var __redisPool: RedisConnectionPool | undefined
}

const redisPool = global.__redisPool ?? new RedisConnectionPool({
  maxConnections: 5, // Conservador para plan gratuito (límite ~30 conexiones)
  minConnections: 1, // Mínimo de 1 para evitar crear conexiones innecesarias
  acquireTimeout: 3000, // Timeout más corto
  idleTimeout: 120000, // 2 minutos - cerrar conexiones idle más rápido
})

if (!global.__redisPool) {
  global.__redisPool = redisPool
  
  // Inicializar el pool al arrancar
  redisPool.initialize().catch(console.error)
  
  // Cleanup al terminar el proceso
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
  operation: (client: RedisClientType) => Promise<T>
): Promise<T | null> {
  let client: RedisClientType | null = null
  
  try {
    client = await redisPool.acquireConnection()
    return await operation(client)
  } catch (error: any) {
    console.error('Redis operation failed:', error.message)
    
    if (error.message.includes('max number of clients reached')) {
      console.error('Redis: Max clients reached. Pool stats:', redisPool.getStats())
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
  operation: (client: RedisClientType) => Promise<T>
): Promise<T | null> {
  return executeRedisOperation(operation)
}

/**
 * Optimized version for multiple Redis operations in sequence
 * Use this when you need to do multiple Redis calls in the same endpoint
 */
export async function batchRedisOperations<T>(
  operations: ((client: RedisClientType) => Promise<T>)[]
): Promise<(T | null)[]> {
  return executeRedisOperation(async (client) => {
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
}

export async function ensureRedisConnection(): Promise<boolean> {
  try {
    const result = await executeRedisOperation(async (client) => {
      return client.ping()
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

// Export pool stats for monitoring
export function getRedisPoolStats() {
  return redisPool.getStats()
}

// Para casos donde necesites acceso directo (usar con cuidado)
export { redisPool }