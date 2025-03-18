import type { APIRoute } from 'astro'
import { rateLimit } from '@middlewares/rate-limit'
import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }
    const cachedData = await redis.get(`episode:${url.searchParams.toString()}`)

    if (cachedData) {
      return new Response(JSON.stringify({ episode: JSON.parse(cachedData) }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }

    const slug = url.searchParams.get('slug')
    const ep = url.searchParams.get('ep')

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!ep) {
      return new Response(
        JSON.stringify({ error: 'Missing episode parameter' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const [, id] = slug.split('_')

    if (!id) {
      return new Response(JSON.stringify({ error: 'Invalid slug format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('anime_episodes')
      .select('*')
      .eq('anime_mal_id', id)
      .eq('episode_id', ep)
      .single()

    await redis.set(
      `episode:${url.searchParams.toString()}`,
      JSON.stringify(data)
    )

    if (error) {
      if (import.meta.env.MODE === 'development') {
        console.error('Supabase Error:', error.message)
      }
      return new Response(
        JSON.stringify({ error: 'Error retrieving episode data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Episode not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ episode: data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    if (import.meta.env.MODE === 'development') {
      console.error('Unhandled Error:', err)
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
