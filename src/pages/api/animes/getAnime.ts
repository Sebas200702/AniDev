import { AnimeController } from '@anime/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { CacheTTL, CacheUtils } from '@utils/cache-utils'
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
    const id = url.searchParams.get('id')
    const parentalControlParam = url.searchParams.get('parentalControl')
    const parentalControl = parentalControlParam !== 'false'
    const animeId = AnimeController.validateNumericId(id)

    const cacheKey = `anime_${animeId}${parentalControl ? '_pc' : ''}`

    const result = await CacheUtils.withCache(
      cacheKey,
      () => AnimeController.handleGetAnimeById(url),
      { ttl: CacheTTL.ONE_HOUR }
    )

    // Anime bloqueado por control parental
    if ('blocked' in result && result.blocked) {
      return ResponseBuilder.forbidden(result.message)
    }

    // Anime no encontrado
    if ('notFound' in result && result.notFound) {
      return ResponseBuilder.notFound('Anime not found')
    }

    return ResponseBuilder.success(result)
  } catch (error: any) {
    return ResponseBuilder.fromError(error, 'GET /api/animes/getAnime')
  }
})
