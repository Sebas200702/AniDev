import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  const animeId = url.searchParams.get('animeId')
  const cacheKey = `anime_music_${animeId}`
  console.log(animeId)

  const cachedData = await redis.get(cacheKey)
  if (cachedData) {
    return new Response(cachedData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  if (!animeId) {

    return new Response('Anime ID is required', { status: 400 })
  }

  const { data, error } = await supabase
    .from('anime_music')
    .select('*')
    .eq('anime_id', animeId)

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  await redis.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 24 })

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
})
