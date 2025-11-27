import { AuthController } from '@auth/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = rateLimit(async ({ request, cookies }) => {
  try {
    const result = await AuthController.handleSignUp(request, cookies)

    return ResponseBuilder.success({
      data: {
        user: {
          name: result.data.user.user_metadata.user_name,
          avatar: result.data.user.user_metadata.avatar_url,
        },
        session: result.data.session,
      },
    })
  } catch (error) {
    return ResponseBuilder.fromError(error, 'POST /api/auth/signup')
  }
})
