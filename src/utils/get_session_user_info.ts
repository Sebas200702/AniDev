import { supabase } from '@libs/supabase'
import { getSession } from 'auth-astro/server'

/**
 * getSessionUserInfo retrieves user information from the current session.
 *
 * @description This function extracts user data from the authentication session.
 * It securely accesses the session associated with the provided request and
 * retrieves the user's name, email and avatar information. If no request is provided
 * or the session doesn't contain user data, appropriate null values are returned.
 *
 * The function handles missing data gracefully by using nullish coalescing to
 * provide fallback values when session properties are undefined. This ensures
 * that the returned object always has a consistent structure even when data
 * is incomplete or missing.
 *
 * @param {Object} params - The parameters for the function
 * @param {Request | undefined} params.request - The request object containing session information
 * @param {string | undefined} params.accessToken - The access token from cookies
 * @param {string | undefined} params.refreshToken - The refresh token from cookies
 * @returns {Promise<Object | null>} An object containing user name, email and avatar, or null if no request
 *
 * @example
 * const userInfo = await getSessionUserInfo({ request, accessToken, refreshToken });
 * if (userInfo) {
 *   console.log(`User: ${userInfo.name}, Email: ${userInfo.email}, Avatar: ${userInfo.avatar}`);
 * }
 */

export const getSessionUserInfo = async ({
  request,
  accessToken,
  refreshToken,
}: {
  request: Request | undefined
  accessToken: string | undefined
  refreshToken: string | undefined
}) => {
  if (!request) return null

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    })

    if (data?.user) {
      return {
        name: data.user.user_metadata?.user_name ?? null,
        avatar: data.user.user_metadata?.avatar_url ?? null,
      }
    }
  }

  const session = await getSession(request)
  if (!session?.user) return null

  const { data, error } = await supabase
    .from('public_users')
    .select('avatar_url')
    .eq('name', session.user.name)
    .single()

  const userInfo = {
    name: session.user.name ?? null,

    avatar: error ? (session.user.image ?? null) : data?.avatar_url,
  }

  return userInfo.name ? userInfo : null
}
