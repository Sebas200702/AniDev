import { AnimeController } from '@anime/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
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
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Caching: Redis-based caching with 1-hour TTL
 * - Input validation: Validates ID format
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Parental control: Blocks content based on parental control settings
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('id') - The anime MAL ID
 * @param {string} context.url.searchParams.get('parentalControl') - Parental control flag
 * @returns {Promise<Response>} A Response object containing the anime data or error message
 */

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {


     const result = await AnimeController.handleGetAnimeById(url)

    return ResponseBuilder.success(result)
  } catch (error: any) {
    return ResponseBuilder.fromError(error, 'GET /api/animes/getAnime')
  }
})
