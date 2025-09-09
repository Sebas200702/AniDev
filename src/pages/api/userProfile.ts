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

    if (!userInfo?.id) {
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
      id: userInfo.id,
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

    profileData.id = userInfo.id

    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userInfo.id)
      .single()

    let result
    if (existingProfile) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', userInfo.id)
        .select()

      result = { data, error }
    } else {

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
