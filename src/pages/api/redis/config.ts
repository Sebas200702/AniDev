import { getRedisPoolStats, logRedisPoolDiagnostics } from '@libs/redis'
import type { APIRoute } from 'astro'

/**
 * Endpoint rápido para verificar configuración del pool
 * GET /api/redis/config
 */
export const GET: APIRoute = async () => {
  try {
    logRedisPoolDiagnostics()

    const stats = getRedisPoolStats()

    const config = {
      timestamp: new Date().toISOString(),
      poolConfiguration: {
        maxConnections: stats.maxConnections,
        currentTotal: stats.total,
        available: stats.available,
        busy: stats.busy,
      },
      status:
        stats.available > 0
          ? 'healthy'
          : stats.busy >= stats.maxConnections
            ? 'saturated'
            : 'warning',
      message:
        stats.maxConnections === 10
          ? '✅ Pool correctly configured with maxConnections: 10'
          : `⚠️  Pool misconfigured! Expected 10, got ${stats.maxConnections}`,
    }

    return new Response(JSON.stringify(config, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
