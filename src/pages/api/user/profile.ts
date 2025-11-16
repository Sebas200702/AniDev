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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await request.json()

    const {
      name,
      last_name,
      birthday,
      gender,
      favorite_animes,
      frequency,
      fanatic_level,
      preferred_format,
      watched_animes,
      favorite_studios,
      favorite_genres,
    } = body

    // ✅ Filtrar campos vacíos
    const clean = <T extends Record<string, any>>(obj: T): Partial<T> =>
      Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => {
          if (value == null) return false
          if (typeof value === 'string') return value.trim() !== ''
          if (Array.isArray(value)) return value.length > 0
          return true
        })
      ) as Partial<T>

    // ✅ Preparar datos limpios
    const profileData = clean({
      id: userInfo.id,
      name,
      last_name,
      birthday,
      gender,
      favorite_animes,
      frequency_of_watch: frequency,
      fanatic_level,
      preferred_format,
      watched_animes,
      favorite_studios,
      favorite_genres,
    })

    // ✅ Upsert: crea o actualiza automáticamente el perfil
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Profile saved successfully',
        data,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in /user/profile endpoint:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    )
  }
})
