import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'

import type { Provider } from '@supabase/supabase-js'

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData()
  const provider = formData.get('provider')?.toString()
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const AllowedProviders: Provider[] = ['google']

  if (!provider || !email || !password) {
    return new Response('The information is not complete', { status: 400 })
  }
  if (provider && AllowedProviders.includes(provider as Provider)) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid profile email',
      },
    })
    if (error) {
      return new Response('Error', { status: 400 })
    }
    return new Response(JSON.stringify(data), { status: 200 })
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return new Response('Error while signing in', { status: 400 })
  }
  const { access_token, refresh_token } = data.session
  cookies.set('access_token', access_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  cookies.set('refresh_token', refresh_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  return redirect('/')
}
