import { AuthService } from '@auth/services'
import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import type { AstroCookies } from 'astro'

/**
 * Auth Controller
 *
 * @description
 * Controller layer for auth endpoints. Handles request parsing,
 * cookie management, and session creation.
 */
export const AuthController = {
  /**
   * Set session cookies
   */
  setSessionCookies(
    cookies: AstroCookies,
    accessToken: string,
    refreshToken: string
  ) {
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    }

    cookies.set('sb-access-token', accessToken, cookieOptions)
    cookies.set('sb-refresh-token', refreshToken, cookieOptions)
  },

  /**
   * Handle sign in request
   */
  async handleSignIn(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      throw AppError.validation('Email and password are required')
    }

    const result = await AuthService.signIn(email, password)

    this.setSessionCookies(
      cookies,
      result.session.access_token,
      result.session.refresh_token
    )

    return { data: result }
  },

  /**
   * Handle sign up request
   */
  async handleSignUp(
    request: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any>> {
    const body = await request.json()
    const { email, password, user_name } = body

    if (!email || !password || !user_name) {
      throw AppError.validation('Email, password and username are required')
    }

    const result = await AuthService.signUp(email, password, user_name)

    this.setSessionCookies(
      cookies,
      result.session.access_token,
      result.session.refresh_token
    )

    return { data: result }
  },
}
