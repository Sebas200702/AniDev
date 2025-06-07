import { supabase } from '@libs/supabase'
import { checkSession } from '@middlewares/auth'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  const userInfo = await getSessionUserInfo({
    request,
    accessToken: cookies.get('sb-access-token')?.value,
    refreshToken: cookies.get('sb-refresh-token')?.value,
  })
  const user = userInfo?.name

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
