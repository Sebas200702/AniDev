import { checkSession } from '@middlewares/auth'
import { UserController } from '@user/controllers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const data = await UserController.handleUpdateUserImages(request, cookies)
    return ResponseBuilder.success({
      message: 'Profile updated successfully',
      data,
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/user/updateProfile')
  }
})
