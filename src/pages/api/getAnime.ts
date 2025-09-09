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
  idResult?: number
}

const CACHE_PREFIX = 'anime_'
const CACHE_TTL = 60 * 60

const pendingRequests = new Map<string, Promise<any>>()

const validateSlug = (id: string | null): ValidationResult => {
  if (!id) {
    return { valid: false, error: 'Slug is required' }
  }

  const idResult = parseInt(id)

  if (isNaN(idResult) || idResult <= 0) {
    return { valid: false, error: 'Invalid anime ID' }
  }

  return { valid: true, idResult }
}

const fetchAnimeData = async (id: number, parentalControl = true) => {
  // Include the anime id in the cache key to avoid returning the same cached
  // result for different ids.
  const cacheKey = `${CACHE_PREFIX}${id}${parentalControl ? '_pc' : ''}`

  const cached = await safeRedisOperation(async (redis) => {
    return await redis.get(cacheKey)
  })

  if (cached) return JSON.parse(cached)

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  const fetchPromise = Promise.resolve(
    supabase.rpc('get_anime_by_id', {
      p_mal_id: id,
      p_parental_control: parentalControl,
    })
  )
    .then(async ({ data, error }) => {
      if (error) throw error
      if (!data?.[0] && parentalControl) {
        const { data: unrestricted } = await supabase.rpc('get_anime_by_id', {
          p_mal_id: id,
          p_parental_control: false,
        })

        if (unrestricted?.[0]) {
          const blockedResult = {
            blocked: true,
            message: 'This content is blocked by parental controls',
          }

          await safeRedisOperation(async (redis) => {
            return await redis.set(cacheKey, JSON.stringify(blockedResult), {
              EX: CACHE_TTL,
            })
          })

          return blockedResult
        }
      }

      if (!data?.[0]) {
        throw new Error('Data not found')
      }

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
    const id = url.searchParams.get('id')
    const parentalControlParam = url.searchParams.get('parentalControl')
    const parentalControl = parentalControlParam === 'false' ? false : true
    const validation = validateSlug(id)

    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await fetchAnimeData(validation.idResult!, parentalControl)

    if (result.blocked) {
      return new Response(
        JSON.stringify({
          blocked: true,
          message: result.message,
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return new Response(JSON.stringify({ data: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
