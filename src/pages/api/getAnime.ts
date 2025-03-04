import type { APIRoute } from 'astro'
import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'

interface ValidationResult {
  valid: boolean
  error?: string
  id?: number
}

const pendingRequests = new Map<string, Promise<any>>()
const CACHE_TTL = 3600
const CACHE_PREFIX = 'anime:'

if (!redis.isOpen) {
  await redis.connect()
}

const validateSlug = (slug: string | null): ValidationResult => {
  if (!slug) return { valid: false, error: 'No title query provided' }

  const [_, id] = slug.split('_')
  if (!id || !/^\d+$/.test(id)) {
    return { valid: false, error: 'Invalid slug format' }
  }

  const numericId = parseInt(id)
  if (isNaN(numericId)) {
    return { valid: false, error: 'Invalid numeric ID' }
  }

  return { valid: true, id: numericId }
}

const fetchAnimeData = async (slug: string, id: number) => {
  const cacheKey = `${CACHE_PREFIX}${slug}`

  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  const fetchPromise = Promise.resolve(supabase.rpc('get_anime_by_id', { id }))
    .then(async ({ data, error }) => {
      if (error || !data?.[0]) throw error || new Error('Data not found')

      const result = data[0]
      await redis.set(cacheKey, JSON.stringify(result), { EX: CACHE_TTL })
      return result
    })
    .finally(() => {
      pendingRequests.delete(cacheKey)
    })

  pendingRequests.set(cacheKey, fetchPromise)
  return fetchPromise
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const slug = url.searchParams.get('slug')
    const validation = validateSlug(slug)

    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (typeof validation.id !== 'number') {
      throw new Error('Invalid ID type')
    }

    const data = await fetchAnimeData(slug!, validation.id)

    return new Response(JSON.stringify({ anime: data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600, s-maxage=3600',
        'CDN-Cache-Control': 'max-age=3600',
        Vary: 'Accept-Encoding',
      },
    })
  } catch (error) {
    console.error('Endpoint error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
