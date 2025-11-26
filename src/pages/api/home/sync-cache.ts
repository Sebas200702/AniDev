import type { AnimeCardInfo } from '@anime/types'
import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
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


    if (!sectionId || !url || !Array.isArray(data)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
      })
    }


    const cacheKey = `home:sections:${userId ?? 'guest'}`
    const existingCache = await CacheService.get<any>(cacheKey)

    if (existingCache) {
      const section = existingCache.find((s: any) => s.id === sectionId)
      if (section) {

        section.url = url
        section.cachedData = data
        section.lastUpdated = Date.now()

        await CacheService.set(cacheKey, existingCache, TtlValues.HOUR)
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
