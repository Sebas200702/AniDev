import { getSessionUserInfo } from '@utils/get_session_user_info'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('accessToken')?.value || ''
    const refreshToken = cookies.get('refreshToken')?.value || ''
    const session = await getSessionUserInfo({
      request,
      accessToken,
      refreshToken,
    })
    return ResponseBuilder.success({ data: session })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'GET /api/auth/session')
  }
}
