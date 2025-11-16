import type { APIRoute } from 'astro'
import { AnimeRepository } from '@anime/repositories'
import { Filters } from '@shared/types'
import { getFilters } from '@utils/get-filters-of-search-params'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { safeRedisOperation } from '@libs/redis'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = `animes-partial:${url.searchParams}`
      const cached = await safeRedisOperation(async (redis) => {
        return await redis.get(cacheKey)
      })

      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const format = url.searchParams.get('format') ?? 'anime-card'
      const limit = parseInt(url.searchParams.get('limit_count') ?? '10')
      const page = parseInt(url.searchParams.get('page_number') ?? '1')

      const CountFilters = Object.keys(Filters).filter(
        (key) =>
          key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
      )

      const filters = getFilters(Object.values(Filters), url, true)
      const countFilters = getFilters(CountFilters, url, false)

      const { data, total } = await AnimeRepository.searchAnime({
        format,
        filters,
        countFilters,
      })

      if (!data || data.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No se encontraron animes.' }),
          { status: 404 }
        )
      }

      const response = {
        total_items: total,
        data,
        current_page: page,
        last_page: Math.ceil(total / limit),
      }

      await safeRedisOperation(async (redis) => {
        return await redis.set(cacheKey, JSON.stringify(response), { EX: 7200 })
      })

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error en el endpoint:', error)
      return new Response(
        JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
        { status: 500 }
      )
    }
  })
)
