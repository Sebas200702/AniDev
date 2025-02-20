import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase.rpc('get_unique_studios')
    if (error) {
      throw new Error('Ocurrió un error al obtener los estudios.')
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.error('Error en el endpoint:', error)
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
