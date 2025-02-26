import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = async ({ url }) => {
  try {
    const title_query = url.searchParams.get('slug')
    if (!title_query) {
      return new Response(
        JSON.stringify({ error: 'No title query provided' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const [, id] = title_query.split('_')
    if (!id) {
      return new Response(JSON.stringify({ error: 'Invalid slug format' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase.rpc('get_anime_by_id', { id })

    if (error) {
      throw new Error('Error retrieving anime data')
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
        'Cache-Control': 'max-age=31536000',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Ups something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
