import type { AnimeCardInfo } from '@anime/types'
import { RedisCacheService } from '@shared/services/redis-cache-service'
import type { APIRoute } from 'astro'
import { getSession } from 'auth-astro/server'

interface SyncRequest {
  sectionId: string
  url: string
  data: AnimeCardInfo[]
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request)
    const userId = session?.user?.id || null

    const { sectionId, url, data } = (await request.json()) as SyncRequest

    // Validar datos
    if (!sectionId || !url || !Array.isArray(data)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
      })
    }

    // Actualizar caché en Redis
    const cacheKey = `home:sections:${userId ?? 'guest'}`
    const existingCache = await RedisCacheService.get<any>(cacheKey)

    if (existingCache) {
      const section = existingCache.find((s: any) => s.id === sectionId)
      if (section) {
        // Actualizar URL y datos de la sección
        section.url = url
        section.cachedData = data
        section.lastUpdated = Date.now()

        await RedisCacheService.set(cacheKey, existingCache, { ttl: 3600 })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Sync cache error:', error)
    return new Response(JSON.stringify({ error: 'Sync failed' }), {
      status: 500,
    })
  }
}
