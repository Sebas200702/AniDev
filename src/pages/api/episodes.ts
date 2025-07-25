import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const id = url.searchParams.get('id')
      const page = url.searchParams.get('page')
        ? parseInt(url.searchParams.get('page') ?? '1', 10)
        : 1

      if (!id) {
        return new Response(JSON.stringify({ error: 'Mal id not found' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (page < 1) {
        return new Response(
          JSON.stringify({ error: 'Page number must be greater than 0' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      const cached = await safeRedisOperation((client) =>
        client.get(`episodes:${id}-${page}`)
      )

      if (cached) {
        return new Response(JSON.stringify({ data: JSON.parse(cached) }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const { data, error } = await supabase
        .from('anime_episodes')
        .select('*')
        .eq('anime_mal_id', id)
        .order('episode_id', { ascending: true })
        .range((page - 1) * 100, page * 100 - 1)

      if (error) {
        throw new Error('Error fetching episodes')
      }
      if (!data) {
        return new Response(
          JSON.stringify({ error: 'No se encontraron episodios' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
      await safeRedisOperation((client) =>
        client.set(`episodes:${id}-${page}`, JSON.stringify(data), { EX: 3600 })
      )
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error in GET /api/episodes:', error)
      return new Response(
        JSON.stringify({ error: 'Ups something went wrong' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  })
)
