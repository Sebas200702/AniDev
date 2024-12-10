import { supabase } from '@libs/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const title_query = url.searchParams.get('slug')

  if (!title_query) {
    return new Response(JSON.stringify({ error: 'No title query' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  const [, id] = title_query.split('_')

  const { data, error } = await supabase.rpc('get_anime_by_id', {
    id,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  return new Response(JSON.stringify({ anime: data[0] }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
