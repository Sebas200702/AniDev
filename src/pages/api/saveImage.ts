import { supabase } from '@libs/supabase'
import { checkSession } from '@middlewares/auth'
import type { APIRoute } from 'astro'
import { getSession } from 'auth-astro/server'

export const POST: APIRoute = checkSession(async ({ request }) => {
  const user = await getSession(request).then((res) => res?.user)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const body = await request.json()
  const avatar = body

  if (!avatar) {
    return new Response(JSON.stringify({ error: 'Avatar is required' }), {
      status: 400,
    })
  }

  const { data, error } = await supabase
    .from('public_users')
    .update({ avatar_url: avatar })
    .eq('name', user.name)
  console.log(user.name)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(
    JSON.stringify({ message: 'Avatar updated successfully', data }),
    {
      status: 200,
    }
  )
})
