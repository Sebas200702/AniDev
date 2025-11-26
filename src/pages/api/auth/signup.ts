import { AuthController } from '@auth/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = rateLimit(async ({ request, cookies }) => {
  try {
    const result = await AuthController.handleSignUp(request, cookies)

    return ResponseBuilder.success({
      user: {
        name: result.user.user_metadata.user_name,
        avatar: result.user.user_metadata.avatar_url,
      },
      session: result.session,
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/auth/signup')
  }
})
