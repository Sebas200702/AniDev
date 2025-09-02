import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('accessToken')?.value || ''
  const refreshToken = cookies.get('refreshToken')?.value || ''
  const session = await getSessionUserInfo({
    request,
    accessToken,
    refreshToken,
  })
  console.log(session)
  return new Response(JSON.stringify({ data: session }))
}
