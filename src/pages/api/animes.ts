import type { APIRoute } from 'astro'
import { rateLimit } from '@middlewares/rate-limit'
import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    const [order_by, order_direction] = url.searchParams
      .get('order_by')
      ?.split(' ') ?? ['relevance_score', 'desc']

    console.log(order_by, order_direction)

    enum Filters {
      limit_count = 'limit_count',
      page_number = 'page_number',
      genre_filter = 'genre_filter',
      type_filter = 'type_filter',
      studio_filter = 'studio_filter',
      score_filter = 'score_filter',
      status_filter = 'status_filter',
      search_query = 'search_query',
      parental_control = 'parental_control',
      year_filter = 'year_filter',
      rating_filter = 'rating_filter',
      banners_filter = 'banners_filter',
      season_filter = 'season_filter',
    }

    const getFilters = (filtersEnum: typeof Filters) => {
      return Object.values(filtersEnum).reduce(
        (filters, filter) => {
          const value = url.searchParams.get(filter)
          if (
            filter === Filters.parental_control ||
            filter === Filters.banners_filter
          ) {
            filters[filter] = value !== 'false'
          } else if (
            filter === Filters.search_query ||
            filter === Filters.page_number ||
            filter === Filters.limit_count
          ) {
            filters[filter] = value ?? null
          } else {
            filters[filter] = value ? value.split('_') : null
          }

          return filters
        },
        {} as Record<string, string | number | boolean | string[] | null>
      )
    }

    enum OrderFunctions {
      relevance_score = 'get_animes',
      relevance_score_asc = 'get_animes_asc',
      score = 'get_animes_order_by_score',
      score_asc = 'get_animes_order_by_score_asc',
      title = 'get_animes_order_by_title',
      title_asc = 'get_animes_order_by_title_asc',
    }

    const getFunctionToExecute = (orderby: string, orderDirection: string) => {
      if (orderby === 'relevancescore') {
        return orderDirection === 'asc'
          ? OrderFunctions.relevance_score_asc
          : OrderFunctions.relevance_score
      }
      if (orderby === 'score') {
        return orderDirection === 'asc'
          ? OrderFunctions.score_asc
          : OrderFunctions.score
      }
      if (orderby === 'title') {
        return orderDirection === 'asc'
          ? OrderFunctions.title_asc
          : OrderFunctions.title
      }
      return OrderFunctions.relevance_score
    }

    const filters = getFilters(Filters)
    const orderFunction = getFunctionToExecute(order_by, order_direction)
    const { data, error } = await supabase.rpc(orderFunction, filters)
    if (error) {
      throw new Error('Ocurrió un error al obtener los animes.')
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error en el endpoint:', error)
    return new Response(JSON.stringify({ error: 'Ups something went wrong' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
})
