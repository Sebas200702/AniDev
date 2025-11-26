import { AppError } from '@shared/errors'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { AstroCookies } from 'astro'

export const getUserFromSession = async (
  request: Request,
  cookies: AstroCookies
) => {
  const userInfo = await getSessionUserInfo({
    request,
    cookies,
  })

  if (!userInfo?.id) {
    throw AppError.unauthorized('Unauthorized')
  }

  return userInfo
}
