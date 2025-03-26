import type { APIRoute } from 'astro'
import { baseTitle } from '@utils/base-url'
import { rateLimit } from '@middlewares/rate-limit'
import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = rateLimit(async ({ url }) => {
  try {
    if (!redis.isOpen) {
      await redis.connect()
    }
    const id = url.searchParams.get('id')

    if (!id) {
      return new Response('Not found', { status: 404 })
    }

    const cached = await redis.get(`anime-metadatas:${id}`)
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
    const { data, error } = await supabase
      .from('old_anime')
      .select('title, synopsis, image_large_webp')
      .eq('mal_id', id)
      .single()

    if (error) {
      console.error('Error al obtener metadatos del anime:', error)
      return new Response('Internal server error', { status: 500 })
    }
    const animeMetadatas = {
      title: `${data.title} - ${baseTitle}`,
      description: data.synopsis,
      image: data.image_large_webp,
    }

    await redis.set(`anime-metadatas:${id}`, JSON.stringify(animeMetadatas), {
      EX: 3600,
    })
    return new Response(JSON.stringify(animeMetadatas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error al obtener metadatos del anime:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
