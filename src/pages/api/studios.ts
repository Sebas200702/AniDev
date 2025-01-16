import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'
import { redis, closeRedis } from '@libs/redis'

export const GET: APIRoute = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }
    const cachedData = await redis.get('studios')

    if (cachedData) {
      await closeRedis()
      return new Response(JSON.stringify(JSON.parse(cachedData)), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    const { data, error } = await supabase.rpc('get_unique_studios')
    if (error) {
      throw new Error('Ocurrió un error al obtener los estudios.')
    }

    await redis.set('studios', JSON.stringify(data))

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'content-type': 'application/json' },
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
  } finally {
    if (redis.isOpen) {
      await closeRedis()
    }
  }
}
