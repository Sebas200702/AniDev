import { createSupabaseServerClient } from '@libs/supabase-server'
import type { UserInfo } from '@user/types'
import type { AstroCookies } from 'astro'
import { getSession } from 'auth-astro/server'

export const getSessionUserInfo = async ({
  request,
  cookies,
}: {
  request: Request
  cookies: AstroCookies
}): Promise<UserInfo | null> => {
  const session = await getSession(request)

  if (!session?.user) return null

  const supabase = createSupabaseServerClient({ request, cookies })

  const accessToken = cookies.get('sb-access-token')?.value
  const refreshToken = cookies.get('sb-refresh-token')?.value

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    })

    if (!data?.user || error) return null

    const { data: metadata } = await supabase
      .from('public_users')
      .select('avatar_url , banner_image , name')
      .eq('id', data.user.id)
      .single()

    return {
      id: data.user.id,
      name: data.user.user_metadata?.user_name,
      avatar: data.user.user_metadata?.avatar_url,
      banner_image: metadata?.banner_image,
    }
  }

  const { data: metadata } = await supabase
    .from('public_users')
    .select('avatar_url , banner_image , name')
    .eq('id', session.user.id)
    .single()

  const userInfo: UserInfo = {
    id: session.user.id ?? null,
    name: session.user.name ?? null,
    avatar: metadata?.avatar_url ?? session.user.image,
    banner_image: metadata?.banner_image,
  }

  return userInfo
}
