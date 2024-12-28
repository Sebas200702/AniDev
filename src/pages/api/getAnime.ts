import { supabase } from '@libs/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const title_query = url.searchParams.get('slug')
  if (!title_query) {
    return new Response(JSON.stringify({ error: 'No title query provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const [, id] = title_query.split('_')
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid slug format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { data, error } = await supabase.rpc('get_anime_by_id', { id })

    if (error) {
      if (import.meta.env.MODE === 'development') {
        console.error('Supabase Error:', error.message)
      }
      return new Response(
        JSON.stringify({ error: 'Error retrieving anime data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Anime not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ anime: data[0] }), {
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
