import { supabase } from '@lib/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  enum Filters {
    limit_count = 'limit_count',
    genre_filter = 'genre_filter',
    type_filter = 'type_filter',
    studio_filter = 'studio_filter',
    score_filter = 'score_filter',
    status_filter = 'status_filter',
    search_query = 'search_query',
  }
  const GetFilters = (
    filtersEnum: typeof Filters
  ): Record<string, string | number | null> => {
    const filters: Record<string, string | number | null> = {}
    Object.values(filtersEnum).forEach((filter) => {
      const value = url.searchParams.get(filter)
      filters[filter] = value
    })
    return filters
  }

  const filters = GetFilters(Filters)

  const { data, error } = await supabase.rpc('get_animes', filters)

  if (error) {
    console.log(error)
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
