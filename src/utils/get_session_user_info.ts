import { getSession } from 'auth-astro/server'

/**
 * getSessionUserInfo retrieves user information from the current session.
 *
 * @description This function extracts user data from the authentication session.
 * It securely accesses the session associated with the provided request and
 * retrieves the user's name and avatar information. If no request is provided
 * or the session doesn't contain user data, appropriate null values are returned.
 *
 * The function handles missing data gracefully by using nullish coalescing to
 * provide fallback values when session properties are undefined. This ensures
 * that the returned object always has a consistent structure even when data
 * is incomplete or missing.
 *
 * @param {Object} params - The parameters for the function
 * @param {Request | undefined} params.request - The request object containing session information
 * @returns {Promise<Object | null>} An object containing user name and avatar, or null if no request
 *
 * @example
 * const userInfo = await getSessionUserInfo({ request });
 * if (userInfo) {
 *   console.log(`User: ${userInfo.name}, Avatar: ${userInfo.avatar}`);
 * }
 */
export const getSessionUserInfo = async ({
  request,
}: {
  request: Request | undefined
}) => {
  if (!request) return null
  const session = await getSession(request)

  const userInfo = {
    name: session?.user?.name ?? null,
    avatar: session?.user?.image ?? null,
  }

  return userInfo
}
