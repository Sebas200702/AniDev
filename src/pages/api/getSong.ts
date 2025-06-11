import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'

import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Slug is required', { status: 400 })
  }

  try {
    const cacheKey = `anime_music_${slug}`
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return new Response(JSON.stringify({ data: JSON.parse(cachedData) }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('anime_music')
      .select('*')
      .eq('title', slug)

    if (error) {
      return new Response(error.message, { status: 500 })
    }

    if (!data) {
      return new Response('Song not found', { status: 404 })
    }

    await redis.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 24 })

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
})
