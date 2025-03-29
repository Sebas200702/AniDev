import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { getFunctionToExecute } from '@utils/get-database-fuction-to-execute'
import { getFilters } from '@utils/get-filters-of-search-params'
import type { APIRoute } from 'astro'
import { Filters } from 'types'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }

    const cachedData = await redis.get(`animes:${url.searchParams}`)
    if (cachedData) {
      return new Response(JSON.stringify(JSON.parse(cachedData)), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    const [order_by, order_direction] = url.searchParams
      .get('order_by')
      ?.split(' ') ?? ['score', 'desc']

    const filters = getFilters(Filters, url)
    const orderFunction = getFunctionToExecute(order_by, order_direction)
    const { data, error } = await supabase.rpc(`${orderFunction}_full`, filters)
    if (error) {
      console.error('Error al obtener los animes:', error)
      throw new Error('Ocurrió un error al obtener los animes.')
    }

    await redis.set(`animes:${url.searchParams}`, JSON.stringify({ data }), {
      EX: 3600,
    })
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600, s-maxage=3600',
        'CDN-Cache-Control': 'max-age=3600',
        Vary: 'Accept-Encoding',
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
