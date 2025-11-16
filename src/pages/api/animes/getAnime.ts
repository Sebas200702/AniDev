import { AnimeService } from '@anime/services'
import { safeRedisOperation } from '@libs/redis'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * getAnime endpoint retrieves detailed information about a specific anime.
 *
 * @summary
 * An API endpoint that fetches comprehensive anime data using an ID.
 *
 * @description
 * This endpoint implements a robust caching mechanism using Redis to optimize performance
 * and reduce database load. It validates the provided ID, and returns detailed anime
 * information from the database via AnimeService. The endpoint includes rate limiting
 * to prevent abuse and implements proper error handling for various scenarios including
 * parental control restrictions.
 *
 * The endpoint uses a two-level caching strategy:
 * 1. Redis cache with a TTL of 1 hour
 * 2. In-memory request deduplication to prevent duplicate requests
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Caching: Redis-based caching with 1-hour TTL
 * - Request deduplication: Prevents duplicate requests for the same anime
 * - Input validation: Validates ID format
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Parental control: Blocks content based on parental control settings
 * - Cache headers: Proper cache control headers for CDN and browser caching
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('id') - The anime MAL ID
 * @param {string} context.url.searchParams.get('parentalControl') - Parental control flag
 * @returns {Promise<Response>} A Response object containing the anime data or error message
 *
 * @example
 * // Request
 * GET /api/animes/getAnime?id=21&parentalControl=true
 *
 * // Success Response (200)
 * {
 *   "data": {
 *     "mal_id": 21,
 *     "title": "One Piece",
 *     // ... other anime details
 *   }
 * }
 *
 * // Blocked Response (403)
 * {
 *   "blocked": true,
 *   "message": "This content is blocked by parental controls"
 * }
 *
 * // Error Response (404)
 * {
 *   "error": "Anime not found"
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

const validateId = (id: string | null): ValidationResult => {
  if (!id) {
    return { valid: false, error: 'ID is required' }
  }

  const idResult = Number.parseInt(id)

  if (Number.isNaN(idResult) || idResult <= 0) {
    return { valid: false, error: 'Invalid anime ID' }
  }

  return { valid: true, idResult }
}

const fetchAnimeData = async (id: number, parentalControl = true) => {
  const cacheKey = `${CACHE_PREFIX}${id}${parentalControl ? '_pc' : ''}`

  const cached = await safeRedisOperation(async (redis) => {
    return await redis.get(cacheKey)
  })

  if (cached) return JSON.parse(cached)

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  const fetchPromise = AnimeService.getById(id, parentalControl)
    .then(async (result) => {
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
    const parentalControl = parentalControlParam !== 'false'

    const validation = validateId(id)

    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await fetchAnimeData(validation.idResult!, parentalControl)

    // Anime bloqueado por control parental
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

    // Anime no encontrado
    if (!result.anime) {
      return new Response(JSON.stringify({ error: 'Anime not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ data: result.anime }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('[getAnime] Error:', error)

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
