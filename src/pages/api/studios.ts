import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'
import { redis , closeRedis } from '@libs/redis'

export const GET: APIRoute = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
  const cachedData = await redis.get('studios')

  if (cachedData) {
    return new Response(JSON.stringify(JSON.parse(cachedData)), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }
  const { data, error } = await supabase.rpc('get_unique_studios')
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  await redis.set('studios', JSON.stringify(data)).then(() => closeRedis())

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
