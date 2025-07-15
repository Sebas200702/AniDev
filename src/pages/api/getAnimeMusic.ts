import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  try {
    const animeId = url.searchParams.get('animeId')
    const cacheKey = `AnimeMusic_${animeId}`

    // Intentar obtener desde cache de forma segura
    const cachedData = await safeRedisOperation(async (redis) => {
      return await redis.get(cacheKey)
    })

    if (cachedData) {
      return new Response(JSON.stringify(JSON.parse(cachedData)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',

        },
      })
    }

    if (!animeId) {
      return new Response(JSON.stringify({ error: 'Anime ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('music')
      .select('*')
      .eq('anime_id', animeId)

    if (error) {
      console.error('Supabase error:', error)
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const responseData = JSON.stringify(data)

    // Guardar en cache de forma segura
    await safeRedisOperation(async (redis) => {
      return await redis.set(cacheKey, responseData, { EX: 60 * 60 * 24 })
    })

    return new Response(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
  
      },
    })
  } catch (error) {
    console.error('getAnimeMusic error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
