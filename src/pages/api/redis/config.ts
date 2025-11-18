import { getRedisClient } from '@libs/redis'
import type { APIRoute } from 'astro'

/**
 * Endpoint para verificar estado de Redis
 * GET /api/redis/config
 */
export const GET: APIRoute = async () => {
  try {
    const client = await getRedisClient()
    const isConnected = client.isReady
    const pingResult = isConnected ? await client.ping() : null

    const config = {
      timestamp: new Date().toISOString(),
      status:
        isConnected && pingResult === 'PONG' ? 'connected' : 'disconnected',
      connection: {
        isReady: client.isReady,
        isOpen: client.isOpen,
        pingResponse: pingResult,
      },
      message: isConnected
        ? '✅ Redis connection is healthy'
        : '❌ Redis connection is not available',
    }

    return new Response(JSON.stringify(config, null, 2), {
      status: isConnected ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        {
          error: error.message,
          timestamp: new Date().toISOString(),
          status: 'error',
        },
        null,
        2
      ),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
