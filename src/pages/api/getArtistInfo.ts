import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { redisConnection } from '@middlewares/redis-connection'
import { normalizeString } from '@utils/normalize-string'
import type { APIRoute } from 'astro'

export const GET: APIRoute = redisConnection(async ({ url }) => {
  const artistName = normalizeString(
    url.searchParams.get('artistName') ?? '',
    false,
    true,
    true
  )

  const cacheKey = `ArtistInfo_${artistName}`

  const cachedData = await safeRedisOperation((client) => client.get(cacheKey))
  if (cachedData) {
    return new Response(JSON.stringify({ data: JSON.parse(cachedData) }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  if (!artistName) {
    return new Response('Artists Name is required', { status: 400 })
  }

  const { data, error } = await supabase.rpc('get_artist_info', {
    artist_name: artistName,
  })

  if (error) {
    console.error('Error fetching artist info:', error)
    return new Response(error.message, { status: 500 })
  }

  await safeRedisOperation((client) =>
    client.set(cacheKey, JSON.stringify(data[0]), { EX: 60 * 60 * 24 })
  )

  return new Response(JSON.stringify({ data: data[0] }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})
