import { supabase } from '@libs/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id')
  const page = url.searchParams.get('page')

  if (!id) {
    return new Response(JSON.stringify({ error: 'Mal id not found' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  const { data, error } = await supabase
    .from('anime_episodes')
    .select('*')
    .eq('anime_mal_id', id)
    .order('episode_id', { ascending: true })
    .limit(100)
    .range(
      page ? (parseInt(page) - 1) * 100 : 0,
      page ? (parseInt(page) - 1) * 100 + 100 : 99
    )

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify({ episodes: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
