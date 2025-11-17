import type { APIRoute } from 'astro'
import { ResponseBuilder } from '@utils/response-builder'
import { UserController } from '@user/controlers'
import { checkSession } from '@middlewares/auth'

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
