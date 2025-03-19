import type { APIRoute } from 'astro'
import { rateLimit } from '@middlewares/rate-limit'
import { supabase } from '@libs/supabase'

export const POST: APIRoute = rateLimit(async ({ request, redirect }) => {
  const formData = await request.formData()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const user_name = formData.get('user_name') as string

  if (!email || !password || !user_name) {
    return new Response('Email, password and username are required', {
      status: 400,
    })
  }

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name,
          avatar_url: '',
        },
      },
    })

    if (error) {
      console.error('Error en el endpoint:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
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

  return redirect('/signin')
})
