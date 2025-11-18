import { AnimeController } from '@anime/controlers'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

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
 * - Server-side Redis caching (2 hours TTL)
 * - CDN caching (2 hours TTL)
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
 */

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = CacheUtils.generateKey('animes-full', url.searchParams)

      const data = await CacheUtils.withCache(
        cacheKey,
        () => AnimeController.handleGetAnimesFull(url),
        { ttl: CacheTTL.ONE_HOUR * 2 }
      )

      return ResponseBuilder.success(
        { data },
        {
          'Cache-Control': 'public, max-age=7200, s-maxage=7200',
          Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
          Vary: 'Accept-Encoding',
        }
      )
    } catch (error) {
      return ResponseBuilder.fromError(error, 'GET /api/animes/full')
    }
  })
)
