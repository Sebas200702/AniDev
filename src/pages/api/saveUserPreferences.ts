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
  const { enfasiscolor, parentalControl } = body

  if (!enfasiscolor && !parentalControl) {
    return new Response(
      JSON.stringify({ error: 'User preferences is required' }),
      {
        status: 400,
      }
    )
  }

  const { data, error } = await supabase
    .from('public_users')
    .update({ enfasis_color: enfasiscolor, parental_control: parentalControl })
    .eq('name', user.name)
  console.log(user.name)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(
    JSON.stringify({ message: 'Preferences updated successfully', data }),
    {
      status: 200,
    }
  )
})
