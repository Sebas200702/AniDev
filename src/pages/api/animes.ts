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
    banners_filter = 'banners_filter',
  }

  const getFilters = (
    filtersEnum: typeof Filters
  ): Record<string, string | number | boolean | string[] | null> => {
    const filters = new Map<
      string,
      string | number | boolean | string[] | null
    >()

    for (const filter of Object.values(filtersEnum)) {
      const value = url.searchParams.get(filter)

      if (
        filter === Filters.parental_control ||
        filter === Filters.banners_filter
      ) {
        filters.set(filter, value !== 'false')
      } else if (
        filter === Filters.search_query ||
        filter === Filters.page_number ||
        filter === Filters.limit_count
      ) {
        filters.set(filter, value ?? null)
      } else {
        filters.set(filter, value ? value.split('_') : null)
      }
    }

    return Object.fromEntries(filters)
  }

  const filters = getFilters(Filters)

  const { data, error } = await supabase.rpc('get_animes', filters)

  if (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('Error al ejecutar RPC get_animes:', error)
    }
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error al obtener los animes.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3000, public',
    },
  })
}
