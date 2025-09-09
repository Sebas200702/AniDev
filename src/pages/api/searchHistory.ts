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

  const searchHistory = await request.json()

  const formattedHistory = Array.isArray(searchHistory) ? searchHistory : []
  const { error } = await supabase.from('search_history').upsert(
    {
      search_history: JSON.stringify(formattedHistory),
      user_id: userInfo.id,
    },
    {
      onConflict: 'user_id',
    }
  )

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ message: 'Search history saved' }), {
    status: 200,
  })
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

  const { data, error } = await supabase
    .from('search_history')
    .select('search_history')
    .eq('user_id', userInfo.id)

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: 'No search history found' }), {
      status: 404,
    })
  }

  const formatedSearchHistory = await JSON.parse(data[0].search_history)

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Error fetching search history' }),
      {
        status: 500,
      }
    )
  }

  return new Response(JSON.stringify(formatedSearchHistory), {
    status: 200,
  })
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

  const { error: deleteError } = await supabase
    .from('search_history')
    .delete()
    .eq('user_id', userInfo.id)

  if (deleteError) {
    console.error(deleteError)
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ message: 'Search history deleted' }), {
    status: 200,
  })
})
