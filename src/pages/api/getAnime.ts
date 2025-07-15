import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * getAnime endpoint retrieves detailed information about a specific anime.
 *
 * @summary
 * An API endpoint that fetches comprehensive anime data using a slug identifier.
 *
 * @description
 * This endpoint implements a robust caching mechanism using Redis to optimize performance
 * and reduce database load. It validates the provided slug format, extracts the anime ID,
 * and returns detailed anime information from the database. The endpoint includes rate
 * limiting to prevent abuse and implements proper error handling for various scenarios.
 *
 * The endpoint uses a two-level caching strategy:
 * 1. Redis cache with a TTL of 1 hour
 * 2. In-memory request deduplication to prevent duplicate requests
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Caching: Redis-based caching with 1-hour TTL
 * - Request deduplication: Prevents duplicate requests for the same anime
 * - Input validation: Validates slug format and ID
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Cache headers: Proper cache control headers for CDN and browser caching
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('slug') - The anime slug in format 'title_id'
 * @returns {Promise<Response>} A Response object containing the anime data or error message
 *
 * @example
 * // Request
 * GET /api/getAnime?slug=one-piece_21
 *
 * // Success Response (200)
 * {
 *   "anime": {
 *     "id": 21,
 *     "title": "One Piece",
 *     // ... other anime details
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

const CACHE_PREFIX = 'anime_'
const CACHE_TTL = 60 * 60 // 1 hour

// Mapa en memoria para prevenir peticiones duplicadas
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
    return { valid: false, error: 'Invalid anime ID' }
  }

  return { valid: true, id }
}

const fetchAnimeData = async (slug: string, id: number) => {
  const cacheKey = `${CACHE_PREFIX}${slug}`

  // Intentar obtener desde cache de forma segura
  const cached = await safeRedisOperation(async (redis) => {
    return await redis.get(cacheKey)
  })

  if (cached) return JSON.parse(cached)

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  const fetchPromise = Promise.resolve(
    supabase.rpc('get_anime_by_id', { p_mal_id: id })
  )
    .then(async ({ data, error }) => {
      if (error || !data?.[0]) throw error || new Error('Data not found')

      const result = data[0]

      // Guardar en cache de forma segura
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

    const anime = await fetchAnimeData(slug!, validation.id!)

    return new Response(JSON.stringify({ anime }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        Expires: new Date(Date.now() + 3600 * 1000).toUTCString(),
      },
    })
  } catch (error: any) {
    console.error('getAnime error:', error)

    const isNotFound = error.message === 'Data not found'
    const status = isNotFound ? 404 : 500
    const message = isNotFound ? 'Anime not found' : 'Internal server error'

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
