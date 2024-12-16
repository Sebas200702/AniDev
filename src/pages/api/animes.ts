import { supabase } from '@libs/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
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
  }

  const getFilters = (
    filtersEnum: typeof Filters
  ): Record<
    string,
    string | number | boolean | string[] | null | undefined
  > => {
    const filters: Record<
      string,
      string | number | boolean | string[] | null | undefined
    > = {}

    Object.values(filtersEnum).forEach((filter) => {
      const value = url.searchParams.get(filter)
      if (filter === Filters.parental_control) {
        filters[filter] = value !== 'false'
        return
      }
      if (filter === Filters.search_query || filter === Filters.page_number || filter === Filters.limit_count ) {
        filters[filter] = value ?? null
        return
      }
      if (value) {
        filters[filter] = value.split('_')
      } else {
        filters[filter] = null
      }
    })
    return filters
  }

  const filters = getFilters(Filters)

  const { data, error } = await supabase.rpc('get_animes', filters)

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify({ anime: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
