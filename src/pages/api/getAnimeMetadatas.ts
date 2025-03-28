import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { baseTitle } from '@utils/base-url'
import type { APIRoute } from 'astro'

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
    if (!data) {
      return new Response(
        JSON.stringify({ error: 'No se encontraron metadatos del anime' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    const animeMetadatas = {
      title: `${data.title} - ${baseTitle}`,
      description: data.synopsis,
      image: data.image_large_webp,
    }
    await redis.set(`anime-metadatas:${id}`, JSON.stringify(animeMetadatas))
    return new Response(JSON.stringify(animeMetadatas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'CDN-Cache-Control': 'max-age=86400',
        Vary: 'Accept-Encoding',
      },
    })
  } catch (error) {
    console.error('Error al obtener metadatos del anime:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
