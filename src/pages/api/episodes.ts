import { supabase } from '@libs/supabase'
import { redis, closeRedis } from '@libs/redis'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  if (!redis.isOpen) {
    await redis.connect()
  }
  const id = url.searchParams.get('id')
  const page = url.searchParams.get('page')
    ? parseInt(url.searchParams.get('page') ?? '1', 10)
    : 1

  if (!id) {
    await closeRedis()
    return new Response(JSON.stringify({ error: 'Mal id not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (page < 1) {
    await closeRedis()
    return new Response(
      JSON.stringify({ error: 'Page number must be greater than 0' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const cached = await redis.get(`episodes:${id}`)

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

    await redis.set(`episodes:${id}`, JSON.stringify(data)).then(() => closeRedis())

    if (error) {
      console.error('Error fetching episodes:', error.message)
      await closeRedis()
      return new Response(
        JSON.stringify({ error: 'Failed to fetch episodes' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
