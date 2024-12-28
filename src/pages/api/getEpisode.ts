import { supabase } from '@libs/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug')
  const ep = url.searchParams.get('ep')

  // Validación de parámetros obligatorios
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

  try {
    const { data, error } = await supabase
      .from('anime_episodes')
      .select('episode_id, title, description, video_url')
      .eq('anime_mal_id', id)
      .eq('episode_id', ep)

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

    return new Response(JSON.stringify({ episode: data[0] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
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
}
