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
  const { animeId, type } = body
  const { data: userData, error: userError } = await supabase
    .from('public_users')
    .select('id')
    .eq('name', user)
    .single()
  if (userError) {
    console.log(userError)
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 500,
    })
  }
  const { data, error } = await supabase.from('watch_list').upsert(
    {
      anime_id: animeId,
      user_id: userData.id,
      type: type,
    },
 
  )
  if (error) {
    console.log(error)
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
  const user = userInfo?.name
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }
  const body = await request.json()
  const { animeId } = body
  const { data: userData, error: userError } = await supabase
    .from('public_users')
    .select('id')
    .eq('name', user)
    .single()
  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 500,
    })
  }

  const { data, error } = await supabase
    .from('watch_list')
    .delete()
    .eq('anime_id', animeId)
    .eq('user_id', userData.id)

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
  const user = userInfo?.name
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }
  const { data: userData, error: userError } = await supabase
    .from('public_users')
    .select('id')
    .eq('name', user)
    .single()
  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 500,
    })
  }

  const { data, error } = await supabase.rpc('get_user_watch_list', {
    p_user_id: userData.id,
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
