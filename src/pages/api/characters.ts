import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { getFilters } from '@utils/get-filters-of-search-params'
import type { APIRoute } from 'astro'
import { CharacterFilters } from 'types'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cacheKey = `characters:${url.searchParams}`
      const cached = await safeRedisOperation((client) => client.get(cacheKey))
      if (cached) {
        return new Response(JSON.stringify(JSON.parse(cached)), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const limit = parseInt(url.searchParams.get('limit_count') ?? '20')
      const page = parseInt(url.searchParams.get('page_number') ?? '1')

      const filters = getFilters(Object.values(CharacterFilters), url, false)

      const { data, error } = await supabase.rpc(
        'get_characters_dynamic',
        filters
      )

      const { role_filter, search_query, language_filter } = getFilters(
        ['role_filter', 'search_query', 'language_filter'],
        url
      )

      const { data: count, error: countError } = await supabase.rpc(
        'get_characters_count',
        { role_filter, search_query, language_filter }
      )

      if (countError) {
        console.error('Error al contar personajes:', countError)
      }

      if (error) {
        console.error('Error al obtener los personajes:', error)
        throw new Error('Ocurrió un error al obtener los personajes.')
      }

      const response = {
        total_items: count ?? 0,
        data,
        current_page: page,
        last_page: Math.ceil((count ?? 0) / limit),
      }

      await safeRedisOperation((client) =>
        client.set(cacheKey, JSON.stringify(response), { EX: 24 * 60 * 60 })
      )

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Error en el endpoint de personajes:', err)
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
