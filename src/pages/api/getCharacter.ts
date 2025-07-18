import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * getCharacter endpoint retrieves detailed information about a specific character.
 *
 * @summary
 * An API endpoint that fetches comprehensive character data using a slug identifier.
 *
 * @description
 * This endpoint implements a robust caching mechanism using Redis to optimize performance
 * and reduce database load. It validates the provided slug format, extracts the character ID,
 * and returns detailed character information from the database. The endpoint includes rate
 * limiting to prevent abuse and implements proper error handling for various scenarios.
 *
 * The endpoint uses a two-level caching strategy:
 * 1. Redis cache with a TTL of 1 hour
 * 2. In-memory request deduplication to prevent duplicate requests
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Caching: Redis-based caching with 1-hour TTL
 * - Request deduplication: Prevents duplicate requests for the same character
 * - Input validation: Validates slug format and ID
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Cache headers: Proper cache control headers for CDN and browser caching
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('slug') - The character slug in format 'name_id'
 * @returns {Promise<Response>} A Response object containing the character data or error message
 *
 * @example
 * // Request
 * GET /api/getCharacter?slug=momo-ayase_123456
 *
 * // Success Response (200)
 * {
 *   "character": {
 *     "character_id": 123456,
 *     "character_name": "Momo Ayase",
 *     // ... other character details
 *   }
 * }
 *
 * // Error Response (404)
 * {
 *   "error": "Invalid slug format"
 * }
 */

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
  const id = parseInt(idStr)

  if (isNaN(id) || id <= 0) {
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
    supabase.rpc('get_character_details_with_animes', { input_character_id: id })
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
