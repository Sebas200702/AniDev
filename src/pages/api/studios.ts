import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(async () => {
  try {
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
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching the studios.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
    }
    if (!data) {
    return new Response(
      JSON.stringify({ error: 'No studios found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    )
    }

    await redis.set('studios', JSON.stringify(data))

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error en el endpoint:', error)
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
