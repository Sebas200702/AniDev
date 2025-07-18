import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { getFilters } from '@utils/get-filters-of-search-params'
import type { APIRoute } from 'astro'
import { Filters } from 'types'

/**
 * Full anime data endpoint with advanced caching and CDN support.
 *
 * @summary
 * An API endpoint that retrieves complete anime data with optimized caching and CDN integration.
 *
 * @description
 * This endpoint provides comprehensive anime data with advanced caching mechanisms
 * and CDN support. It implements a multi-level caching strategy using Redis for
 * server-side caching and HTTP cache headers for CDN and browser caching. The
 * endpoint supports dynamic sorting and filtering of anime data, with optimized
 * database queries using stored procedures.
 *
 * The endpoint features:
 * - Server-side Redis caching (1 hour TTL)
 * - CDN caching (1 hour TTL)
 * - Browser caching (10 minutes TTL)
 * - Dynamic sorting and filtering
 * - Rate limiting protection
 *
 * @features
 * - Multi-level caching strategy
 * - CDN integration
 * - Rate limiting
 * - Dynamic sorting
 * - Comprehensive filtering
 * - Error handling
 * - Performance optimization
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('order_by') - Sort field and direction
 * @param {Filters} context.url.searchParams - Additional filter parameters
 * @returns {Promise<Response>} A Response object containing full anime data or error message
 *
 * @example
 * // Request
 * GET /api/animes/full?order_by=score desc
 *
 * // Success Response (200)
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "Example Anime",
 *       "score": 8.5,
 *       "synopsis": "Detailed description...",
 *       "episodes": [...],
 *       // ... complete anime data
 *     }
 *   ]
 * }
 *
 * // Error Response (500)
 * {
 *   "error": "Ups something went wrong"
 * }
 */

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cachedData = await safeRedisOperation((client) =>
        client.get(`animes:${url.searchParams}`)
      )
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

      const filters = getFilters(Object.values(Filters), url)

      const { data, error } = await supabase.rpc('get_animes_full', filters)
      if (error) {
        console.error('Error al obtener los animes:', error)
        throw new Error('Ocurrió un error al obtener los animes.')
      }

      await safeRedisOperation((client) =>
        client.set(`animes:${url.searchParams}`, JSON.stringify({ data }), {
          EX: 3600,
        })
      )
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',

          Vary: 'Accept-Encoding',
        },
      })
    } catch (error) {
      console.error('Error en el endpoint:', error)
      return new Response(
        JSON.stringify({ error: 'Ups something went wrong' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  })
)
