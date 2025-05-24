import { supabase } from '@libs/supabase'
import { checkSession } from '@middlewares/auth'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
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

    const formData = await request.formData()



    const name = formData.get('name') as string
    const last_name = formData.get('last_name') as string
    const birthday = formData.get('birthday') as string
    const gender = formData.get('gender') as string
    const frequency = formData.get('frequency') as string
    const fanatic_level = formData.get('fanatic_level') as string
    const preferred_format = formData.get('preferred_format') as string


    const favorite_animes = Array.from(
      formData.getAll('favorite_animes')
    ).filter(Boolean)
    const watched_animes = Array.from(formData.getAll('watched_animes')).filter(
      Boolean
    )
    const favorite_studios = Array.from(
      formData.getAll('favorite_studios')
    ).filter(Boolean)
    const favorite_genres = Array.from(
      formData.getAll('favorite_genres')
    ).filter(Boolean)

    const { data: userId, error: errorUserId } = await supabase
      .from('public_users')
      .select('id')
      .eq('name', user)

    if (errorUserId) {
      return new Response(JSON.stringify({ error: errorUserId.message }), {
        status: 500,
      })
    }

    if (!userId || userId.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }


    const { data: historyId, error: errorHistoryId } = await supabase
      .from('search_history')
      .select('id')
      .eq('user_id', userId[0].id)

    if (errorHistoryId) {
      return new Response(JSON.stringify({ error: errorHistoryId.message }), {
        status: 500,
      })
    }

    const filterNonNullFields = (data: Record<string, any>) => {
      const filtered: Record<string, any> = {}

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'string' && value.trim() !== '') {
            filtered[key] = value
          } else if (Array.isArray(value) && value.length > 0) {
            filtered[key] = value
          } else if (typeof value !== 'string' && !Array.isArray(value)) {
            filtered[key] = value
          }
        }
      })

      return filtered
    }

    const rawProfileData = {
      user_id: userId[0].id,
      history_id: historyId?.[0]?.id || null,
      name: name || null,
      last_name: last_name || null,
      birthday: birthday || null,
      gender: gender || null,
      favorite_animes: favorite_animes.length > 0 ? favorite_animes : null,
      frequency_of_watch: frequency || null,
      fanatic_level: fanatic_level || null,
      preferred_format: preferred_format || null,
      watched_animes: watched_animes.length > 0 ? watched_animes : null,
      favorite_studios: favorite_studios.length > 0 ? favorite_studios : null,
      favorite_genres: favorite_genres.length > 0 ? favorite_genres : null,
    }

    const profileData = filterNonNullFields(rawProfileData)

    profileData.user_id = userId[0].id

    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId[0].id)
      .single()

    let result
    if (existingProfile) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', userId[0].id)
        .select()

      result = { data, error }
    } else {
      profileData.history_id = historyId?.[0]?.id || null
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()

      result = { data, error }
    }

    if (result.error) {
      return new Response(
        JSON.stringify({
          error: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code,
        }),
        {
          status: 500,
        }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Profile updated successfully',
        data: result.data,
      }),
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error en el endpoint:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
      }
    )
  }
})
