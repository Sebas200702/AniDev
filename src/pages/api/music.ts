import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { getFilters } from '@utils/get-filters-of-search-params'
import type { APIRoute } from 'astro'
import { MusicFilters } from 'types'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cached = await safeRedisOperation((client) =>
        client.get(`music:${url.searchParams}`)
      )
      if (cached) {
        return new Response(JSON.stringify(JSON.parse(cached)), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const CountFilters = Object.keys(MusicFilters).filter(
        (key) =>
          key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
      )

      const limit = parseInt(url.searchParams.get('limit_count') ?? '10')
      const page = url.searchParams.get('page_number')
      const filters = getFilters(Object.values(MusicFilters), url, false)
      const countFilters = getFilters(CountFilters, url, false)

      const { data, error } = await supabase.rpc('get_music', filters)

      const { data: count, error: countError } = await supabase.rpc(
        'get_music_count',
        countFilters
      )
      if (countError) {
        console.error('Error al obtener el conteo de musicas:', countError)
      }

      const response = {
        total_items: count,
        data,
        current_page: page,
        last_page: Math.ceil(count / limit),
      }

      if (error) {
        console.error('Error al obtener los animes:', error)
        throw new Error('Ocurrió un error al obtener los musicas.')
      }
      await safeRedisOperation((client) =>
        client.set(`music:${url.searchParams}`, JSON.stringify(response), {
          EX: 24 * 60 * 60,
        })
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
