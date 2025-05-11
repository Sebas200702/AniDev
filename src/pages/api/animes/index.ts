import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
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

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
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
      const CountFilters = Object.keys(Filters).filter(
        (key) =>
          key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
      )

      const limit = parseInt(url.searchParams.get('limit_count') ?? '10')
      const page = url.searchParams.get('page_number')
      const filters = getFilters(Object.values(Filters), url)
      const countFilters = getFilters(CountFilters, url)

      enum Formats {
        AnimeCard = 'anime-card',
        AnimeBanner = 'anime-banner',
        TopAnime = 'top-anime',
        AnimeCollection = 'anime-collection',
        AnimeDetail = 'anime-detail',
        Search = 'search',
      }
      const getFormat = (format: string) => {
        if (format === Formats.AnimeCard) return 'get_anime_summary_card'
        if (format === Formats.AnimeBanner) return 'get_animes_banner'
        if (format === Formats.TopAnime) return 'get_top_animes'
        if (format === Formats.AnimeDetail) return 'get_anime_detail_card'
        if (format === Formats.AnimeCollection) return 'get_animes_collection'
        if (format === Formats.Search) return 'get_anime_summary_card'

        return 'get_anime_summary_card'
      }
      const formatFunction = getFormat(format ?? '')

      const { data, error } = await supabase.rpc(formatFunction, filters)
      const { data: count, error: countError } = await supabase.rpc(
        'get_anime_count',
        countFilters
      )
      const response = {
        total_items: count,
        data,
        current_page: page,
        last_page: Math.ceil(count / limit),
      }

      if (error) {
        console.error('Error al obtener los animes:', error)
        throw new Error('Ocurrió un error al obtener los animes.')
      }
      await redis.set(
        `animes-partial:${url.searchParams}`,
        JSON.stringify(response),
        {
          EX: 24 * 60 * 60,
        }
      )

      return new Response(JSON.stringify(response), {
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
)
