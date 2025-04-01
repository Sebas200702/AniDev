import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { getFunctionToExecute } from '@utils/get-database-fuction-to-execute'
import { getFilters } from '@utils/get-filters-of-search-params'
import type { APIRoute } from 'astro'
import { Filters } from 'types'

/**
 * Main anime listing endpoint with multiple format options.
 *
 * @summary
 * An API endpoint that retrieves anime listings with various formats and filtering options.
 *
 * @description
 * This endpoint provides a flexible way to retrieve anime data in different formats
 * based on the requested view type. It supports multiple display formats including
 * cards, banners, top anime lists, collections, and search results. The endpoint
 * implements caching using Redis to optimize performance and includes rate limiting
 * to prevent abuse.
 *
 * Supported formats:
 * - AnimeCard: Grid view of anime cards
 * - AnimeBanner: Banner-style listings
 * - TopAnime: Highest rated anime
 * - AnimeCollection: Curated collections
 * - Search: Custom search results with sorting
 *
 * @features
 * - Multiple display formats
 * - Redis caching with 24-hour TTL
 * - Rate limiting
 * - Dynamic sorting and filtering
 * - Comprehensive error handling
 * - Query parameter support
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('format') - Display format type
 * @param {string} context.url.searchParams.get('order_by') - Sort field and direction
 * @param {Filters} context.url.searchParams - Additional filter parameters
 * @returns {Promise<Response>} A Response object containing anime data or error message
 *
 * @example
 * // Request
 * GET /api/animes?format=anime-card&order_by=score desc
 *
 * // Success Response (200)
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "Example Anime",
 *       "score": 8.5,
 *       // ... other anime data
 *     }
 *   ]
 * }
 *
 * // Error Response (500)
 * {
 *   "error": "Ocurrió un error en el servidor."
 * }
 */

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }

    const cached = await redis.get(`animes-partial:${url.searchParams}`)
    if (cached) {
      return new Response(JSON.stringify({ data: JSON.parse(cached) }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    const format = url.searchParams.get('format')
    const [order_by, order_direction] = url.searchParams
      .get('order_by')
      ?.split(' ') ?? ['score', 'desc']

    const filters = getFilters(Filters, url)

    enum Formats {
      AnimeCard = 'anime-card',
      AnimeBanner = 'anime-banner',
      TopAnime = 'top-anime',
      AnimeCollection = 'anime-collection',
      Search = 'search',
    }
    const getFormat = (format: string) => {
      if (format === Formats.AnimeCard) return 'get_animes_order_by_score'
      if (format === Formats.AnimeBanner) return 'get_animes_banner'
      if (format === Formats.TopAnime) return 'get_top_animes'
      if (format === Formats.AnimeCollection) return 'get_animes_collection'
      if (format === Formats.Search)
        return getFunctionToExecute(order_by, order_direction)
      return 'get_animes_order_by_score'
    }
    const formatFunction = getFormat(format ?? '')

    const { data, error } = await supabase.rpc(formatFunction, filters)

    if (error) {
      console.error('Error al obtener los animes:', error)
      throw new Error('Ocurrió un error al obtener los animes.')
    }
    await redis.set(
      `animes-partial:${url.searchParams}`,
      JSON.stringify(data),
      {
        EX: 24 * 60 * 60,
      }
    )

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
