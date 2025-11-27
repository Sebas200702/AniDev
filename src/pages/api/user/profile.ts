import { checkSession } from '@middlewares/auth'
import { UserController } from '@user/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const data = await UserController.handleSaveProfile(request, cookies)
    return ResponseBuilder.success({
      data,
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/user/profile')
  }
})
