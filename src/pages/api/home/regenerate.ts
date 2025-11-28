import { HomeController } from '@shared/controllers/home-controller'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const userInfo = await getSessionUserInfo({
      request,
      cookies,
    })

    const userId = userInfo?.id ?? null

    const sections = await HomeController.regenerateHomeSections(userId)
    return ResponseBuilder.success(sections)
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/home/regenerate')
  }
}
