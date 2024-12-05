import  { supabase } from '@lib/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
    const slug = url.searchParams.get('slug')
    const { data, error } = await supabase.from('anime').select('*').eq('title', slug)
    if (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    return new Response(JSON.stringify({anime: data[0]}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
}
