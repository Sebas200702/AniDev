import { redis, safeRedisOperation } from '@libs/redis'

/**
 * Redis health check and connection management utility.
 *
 * @description This utility provides functions to monitor Redis health,
 * perform cleanup operations, and manage connection issues to prevent
 * "max number of clients reached" errors.
 */

export interface RedisHealthStatus {
  isConnected: boolean
  isReady: boolean
  lastError?: string
  connectionCount?: number
  memoryUsage?: string
  uptime?: number
}

/**
 * Performs a comprehensive health check of the Redis connection.
 *
 * @returns {Promise<RedisHealthStatus>} Health status object
 */
export async function checkRedisHealth(): Promise<RedisHealthStatus> {
  const healthStatus: RedisHealthStatus = {
    isConnected: redis.isOpen,
    isReady: redis.isReady,
  }

  try {
    // Intentar obtener información del servidor Redis
    const info = await safeRedisOperation(async (client) => {
      return await client.info('clients,memory,server')
    })

    if (info) {
      // Parsear información de clientes conectados
      const clientsMatch = info.match(/connected_clients:(\d+)/)
      if (clientsMatch) {
        healthStatus.connectionCount = parseInt(clientsMatch[1])
      }

      // Parsear uso de memoria
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/)
      if (memoryMatch) {
        healthStatus.memoryUsage = memoryMatch[1].trim()
      }

      // Parsear uptime
      const uptimeMatch = info.match(/uptime_in_seconds:(\d+)/)
      if (uptimeMatch) {
        healthStatus.uptime = parseInt(uptimeMatch[1])
      }
    }

    // Hacer un ping simple para verificar conectividad
    const pingResult = await safeRedisOperation(async (client) => {
      return await client.ping()
    })

    healthStatus.isReady = pingResult === 'PONG'
  } catch (error: any) {
    healthStatus.lastError = error.message
    healthStatus.isReady = false
  }

  return healthStatus
}

/**
 * Attempts to clean up Redis connections and recover from max clients error.
 *
 * @returns {Promise<boolean>} True if cleanup was successful
 */
export async function cleanupRedisConnections(): Promise<boolean> {
  try {
    console.log('Redis: Starting connection cleanup...')

    // Verificar el estado actual
    const healthBefore = await checkRedisHealth()
    console.log(
      `Redis: Current connections: ${healthBefore.connectionCount || 'unknown'}`
    )

    // Si ya no está conectado, no hay nada que limpiar
    if (!redis.isOpen) {
      console.log('Redis: No active connection to cleanup')
      return true
    }

    // Intentar hacer quit de la conexión actual de forma controlada
    await safeRedisOperation(async (client) => {
      return await client.quit()
    })

    // Esperar un momento para que se liberen las conexiones
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verificar el estado después del cleanup
    const healthAfter = await checkRedisHealth()
    console.log(
      `Redis: Connections after cleanup: ${healthAfter.connectionCount || 'unknown'}`
    )

    return true
  } catch (error: any) {
    console.error('Redis: Cleanup failed:', error.message)
    return false
  }
}

/**
 * Monitors Redis connection health and automatically performs cleanup if needed.
 *
 * @param {number} maxConnections - Maximum allowed connections before cleanup
 * @returns {Promise<void>}
 */
export async function monitorRedisHealth(
  maxConnections: number = 50
): Promise<void> {
  try {
    const health = await checkRedisHealth()

    console.log(`Redis Health Check:`, {
      connected: health.isConnected,
      ready: health.isReady,
      connections: health.connectionCount,
      memory: health.memoryUsage,
      uptime: health.uptime
        ? `${Math.floor(health.uptime / 60)} minutes`
        : 'unknown',
    })

    // Si hay demasiadas conexiones, intentar cleanup
    if (health.connectionCount && health.connectionCount > maxConnections) {
      console.warn(
        `Redis: High connection count (${health.connectionCount}), attempting cleanup...`
      )
      await cleanupRedisConnections()
    }

    // Si hay errores de conexión, reportar
    if (health.lastError) {
      console.error(`Redis: Health check error: ${health.lastError}`)
    }
  } catch (error: any) {
    console.error('Redis: Health monitoring failed:', error.message)
  }
}

/**
 * Sets up periodic Redis health monitoring.
 *
 * @param {number} intervalMinutes - Check interval in minutes
 * @param {number} maxConnections - Max connections before cleanup
 */
export function setupRedisHealthMonitoring(
  intervalMinutes: number = 5,
  maxConnections: number = 50
): void {
  console.log(
    `Redis: Setting up health monitoring every ${intervalMinutes} minutes`
  )

  setInterval(
    () => {
      monitorRedisHealth(maxConnections)
    },
    intervalMinutes * 60 * 1000
  )

  // Hacer un check inicial
  monitorRedisHealth(maxConnections)
}
