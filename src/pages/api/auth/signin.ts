import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

export const POST: APIRoute = rateLimit(
  async ({ request, redirect, cookies }) => {
    const formData = await request.formData()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error en el endpoint:', error)
      return new Response(error.message, { status: 400 })
    }
    const { access_token, refresh_token } = data.session
    cookies.set('sb-access-token', access_token, {
      path: '/',
    })
    cookies.set('sb-refresh-token', refresh_token, {
      path: '/',
    })

    return redirect('/')
  }
)
