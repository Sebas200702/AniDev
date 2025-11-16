import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'



interface ValidationResult {
  valid: boolean
  error?: string
  id?: number
}

const CACHE_PREFIX = 'character_'
const CACHE_TTL = 60 * 60

const pendingRequests = new Map<string, Promise<any>>()

const validateSlug = (slug: string | null): ValidationResult => {
  if (!slug) {
    return { valid: false, error: 'Slug is required' }
  }

  const lastUnderscoreIndex = slug.lastIndexOf('_')
  if (lastUnderscoreIndex === -1) {
    return { valid: false, error: 'Invalid slug format' }
  }

  const idStr = slug.slice(lastUnderscoreIndex + 1)
  const id = Number.parseInt(idStr)

  if (Number.isNaN(id) || id <= 0) {
    return { valid: false, error: 'Invalid character ID' }
  }

  return { valid: true, id }
}

const fetchCharacterData = async (slug: string, id: number) => {
  const cacheKey = `${CACHE_PREFIX}${slug}`

  const cached = await safeRedisOperation(async (redis) => {
    return await redis.get(cacheKey)
  })

  if (cached) return JSON.parse(cached)

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  const fetchPromise = Promise.resolve(
    supabase.rpc('get_character_details_with_animes', {
      input_character_id: id,
    })
  )
    .then(async ({ data, error }) => {
      if (error || !data?.[0]) throw error || new Error('Data not found')

      const result = data[0]
      await safeRedisOperation(async (redis) => {
        return await redis.set(cacheKey, JSON.stringify(result), {
          EX: CACHE_TTL,
        })
      })

      return result
    })
    .finally(() => {
      pendingRequests.delete(cacheKey)
    })

  pendingRequests.set(cacheKey, fetchPromise)
  return fetchPromise
}

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const slug = url.searchParams.get('slug')
    const validation = validateSlug(slug)

    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const character = await fetchCharacterData(slug!, validation.id!)

    return new Response(JSON.stringify({ character }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('getCharacter error:', error)

    const isNotFound = error.message === 'Data not found'
    const status = isNotFound ? 404 : 500
    const message = isNotFound ? 'Character not found' : 'Internal server error'

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
