import type { APIRoute } from 'astro'
import { rateLimit } from '@middlewares/rate-limit'
import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }

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

    const cached = await redis.get(`episodes:${id}-${page}`)

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

    await redis.set(`episodes:${id}-${page}`, JSON.stringify(data), {
      EX: 3600,
    })

    if (error) {
      throw new Error('Error fetching episodes')
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=31536000',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Ups something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
