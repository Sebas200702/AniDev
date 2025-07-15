import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  const themeId = url.searchParams.get('themeId')
  const cacheKey = `MusicInfo_${themeId}`

  const cachedData = await safeRedisOperation((client) => client.get(cacheKey))
  if (cachedData) {
    return new Response(JSON.stringify(JSON.parse(cachedData)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',

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

  await safeRedisOperation((client) =>
    client.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 24 })
  )

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})
