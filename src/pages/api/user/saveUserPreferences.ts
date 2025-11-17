import { checkSession } from '@middlewares/auth'
import { UserController } from '@user/controlers'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const data = await UserController.handleUpdatePreferences(request, cookies)
    return ResponseBuilder.success({
      message: 'Preferences updated successfully',
      data,
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/saveUserPreferences')
  }
})
