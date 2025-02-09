import type { APIRoute } from 'astro'
import { supabase } from '@libs/supabase'

import type { Provider } from '@supabase/supabase-js'

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData()
  const provider = formData.get('provider')?.toString()
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const userName = formData.get('user_name')?.toString()

  if (!provider || !email || !password || !userName) {
    return new Response('The information is not complete', { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: userName,
      },
    },
  })
  if (error) {
    return new Response('Error while signing up', { status: 400 })
  }

  return redirect('/api/auth/signin')
}
