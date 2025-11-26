import { AuthController } from '@auth/controllers'
import { rateLimit } from '@middlewares/rate-limit'
import { ResponseBuilder } from '@utils/response-builder'
import type { APIRoute } from 'astro'

export const POST: APIRoute = rateLimit(
  async ({ request, redirect, cookies }) => {
    try {
      await AuthController.handleSignIn(request, cookies)
      return redirect('/')
    } catch (error) {
      return ResponseBuilder.fromError(error, 'POST /api/auth/signin')
    }
  }
)
