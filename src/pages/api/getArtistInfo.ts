import type { APIRoute } from 'astro'
import { redisConnection } from '@middlewares/redis-connection'
import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = redisConnection(async ({url}) => {
    const artistName = url.searchParams.get('artistName')

  const cacheKey = `ArtistInfo_${artistName}`

  const cachedData = await safeRedisOperation((client) => client.get(cacheKey))
  if (cachedData) {
    return new Response(JSON.stringify({data: JSON.parse(cachedData)}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  if (!artistName) {
    return new Response('Artists Name is required', { status: 400 })
  }

  const { data, error } = await supabase.rpc('get_artist_info', { artist_name :artistName
  })

  if (error) {
    console.error('Error fetching artist info:', error)
    return new Response(error.message, { status: 500 })
  }

  await safeRedisOperation((client) =>
    client.set(cacheKey, JSON.stringify(data), { EX: 60 * 60 * 24 })
  )

  return new Response(JSON.stringify({data}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})
