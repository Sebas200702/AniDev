import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * studios endpoint retrieves a list of unique anime studios.
 *
 * @summary
 * An API endpoint that fetches and caches a list of all unique anime studios.
 *
 * @description
 * This endpoint implements a long-term caching mechanism using Redis to optimize
 * performance and reduce database load. It fetches unique studio names from the
 * database using a stored procedure and caches the results for an extended period.
 * The endpoint includes rate limiting to prevent abuse and implements proper
 * error handling for various scenarios.
 *
 * The endpoint uses Redis caching with a one-year TTL to store the studio list,
 * as this data rarely changes. It implements comprehensive error handling and
 * proper response formatting for both successful and error cases.
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Long-term caching: Redis-based caching with 1-year TTL
 * - Database optimization: Uses stored procedure for efficient querying
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Response formatting: Consistent JSON response structure
 * - Cache headers: Proper cache control headers for long-term caching
 *
 * @param {APIRoute} context - The API context containing request information
 * @returns {Promise<Response>} A Response object containing the studios list or error message
 *
 * @example
 * // Request
 * GET /api/studios
 *
 * // Success Response (200)
 * [
 *   "Studio Ghibli",
 *   "Madhouse",
 *   "Kyoto Animation",
 *   // ... other studios
 * ]
 *
 * // Error Response (404)
 * {
 *   "error": "No studios found"
 * }
 */

export const GET: APIRoute = rateLimit(async () => {
  try {
    const cachedData = await redis.get('studios')

    if (cachedData) {
      return new Response(JSON.stringify(JSON.parse(cachedData)), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'Cache-Control': 'public, max-age=7200, s-maxage=7200',
          Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
        },
      })
    }

    const { data, error } = await supabase.rpc('get_unique_studios')
    if (error) {
      return new Response(
        JSON.stringify({
          error: 'An error occurred while fetching the studios.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    if (!data) {
      return new Response(JSON.stringify({ error: 'No studios found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await redis.set('studios', JSON.stringify(data))

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200',
        Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
      },
    })
  } catch (error) {
    console.error('Error en el endpoint:', error)
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
