import { supabase } from '@libs/supabase'
import type { APIRoute } from 'astro'
import { redis } from '@libs/redis'

export const GET: APIRoute = async ({ url }) => {
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
  if (!redis.isOpen) {
    await redis.connect()
  }
  const cachedData = await redis.get(url.toString())
  if (cachedData) {
    return new Response(JSON.stringify(JSON.parse(cachedData)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { data, error } = await supabase
      .from('anime_episodes')
      .select('*')
      .eq('anime_mal_id', id)
      .order('episode_id', { ascending: true })
      .range((page - 1) * 100, page * 100 - 1)

    if (error) {
      console.error('Error fetching episodes:', error.message)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch episodes' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    await redis.set(url.toString(), JSON.stringify(data), { EX: 3600 })
    return new Response(JSON.stringify({ episodes: data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
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
