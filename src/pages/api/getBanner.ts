import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const anime_id = parseInt(url.searchParams.get('anime_id') ?? '')
  const limit_count = parseInt(url.searchParams.get('limit_count') ?? '8')
  try {
    if (!anime_id || isNaN(anime_id)) {
      return new Response(
        JSON.stringify({ message: 'Error anime_id is required ' }),
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('get_anime_banner', {
      p_anime_id: anime_id,
      p_limit_count: limit_count,
    })
    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    const isNotFound = error.message === 'Data not found'
    const status = isNotFound ? 404 : 500
    const message = isNotFound ? 'Character not found' : 'Internal server error'

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
