import type { APIRoute } from 'astro'
import { Filters } from 'types'
import { getFilters } from '@utils/get-filters-of-search-params'
import { getFunctionToExecute } from '@utils/get-database-fuction-to-execute'
import { rateLimit } from '@middlewares/rate-limit'
import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'

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
      JSON.stringify({ data }),
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
