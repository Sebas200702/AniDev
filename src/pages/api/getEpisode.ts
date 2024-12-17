import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug')
  const ep = url.searchParams.get('ep')
  if (!slug || !ep) {
    return new Response(JSON.stringify({ error: 'No slug or ep provided' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  const [, id] = slug.split('_')

  const { data, error } = await supabase
    .from('anime_episodes')
    .select('*')
    .eq('anime_mal_id', id)
    .eq('episode_id', ep)

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify({ episode: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
