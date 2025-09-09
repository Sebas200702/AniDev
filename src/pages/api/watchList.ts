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

  if (!userInfo?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }
  const body = await request.json()
  const { animeId, type } = body

  const { error } = await supabase.from('watch_list').upsert({
    anime_id: animeId,
    user_id: userInfo?.id,
    type: type,
  })
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
  return new Response(
    JSON.stringify({ message: 'Anime added to watch list' }),
    {
      status: 200,
    }
  )
})

export const DELETE: APIRoute = checkSession(async ({ request, cookies }) => {
  const userInfo = await getSessionUserInfo({
    request,
    accessToken: cookies.get('sb-access-token')?.value,
    refreshToken: cookies.get('sb-refresh-token')?.value,
  })

  if (!userInfo?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }
  const body = await request.json()
  const { animeId } = body

  const { error } = await supabase
    .from('watch_list')
    .delete()
    .eq('anime_id', animeId)
    .eq('user_id', userInfo?.id)

  if (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
  return new Response(
    JSON.stringify({ message: 'Anime removed from watch list' }),
    {
      status: 200,
    }
  )
})

export const GET: APIRoute = checkSession(async ({ request, cookies }) => {
  const userInfo = await getSessionUserInfo({
    request,
    accessToken: cookies.get('sb-access-token')?.value,
    refreshToken: cookies.get('sb-refresh-token')?.value,
  })

  if (!userInfo?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const { data, error } = await supabase.rpc('get_user_watch_list', {
    p_user_id: userInfo?.id,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
  return new Response(JSON.stringify(data), {
    status: 200,
  })
})
