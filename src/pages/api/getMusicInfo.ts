import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  const themeId = url.searchParams.get('themeId')
  const cacheKey = `MusicInfo_${themeId}`

  const cachedData = await redis.get(cacheKey)
  if (cachedData) {
    return new Response(cachedData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200',
        Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
      },
    })
  }

  if (!themeId) {
    return new Response('Theme ID is required', { status: 400 })
  }

  const { data, error } = await supabase.rpc('get_music_by_theme_id', {
    p_theme_id: themeId,
  })

  if (error) {
    console.error('Error fetching music info:', error)
    return new Response(error.message, { status: 500 })

  }

  await redis.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 24 })

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=7200, s-maxage=7200',
      Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
    },
  })
})
