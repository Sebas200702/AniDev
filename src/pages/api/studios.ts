import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.rpc('get_unique_studios')
  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
