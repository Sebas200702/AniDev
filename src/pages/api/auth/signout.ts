import { supabase } from '@libs/supabase'

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ url, redirect }) => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  return redirect(url.pathname)
}
