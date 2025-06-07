import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * Sign-in endpoint for user authentication.
 *
 * @summary
 * An API endpoint that handles user authentication using email and password.
 *
 * @description
 * This endpoint processes user sign-in requests using Supabase authentication.
 * It validates user credentials, creates a session, and sets secure HTTP-only cookies
 * for maintaining the authentication state. The endpoint includes rate limiting to
 * prevent brute force attacks and implements proper error handling for various
 * authentication scenarios.
 *
 * The endpoint uses Supabase's authentication system with password-based sign-in
 * and implements secure cookie handling for session management. It includes
 * comprehensive error handling and input validation to ensure secure authentication.
 *
 * @features
 * - Rate limiting: Prevents brute force attacks
 * - Secure cookies: HTTP-only cookies for token storage
 * - Input validation: Email and password validation
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Session management: Secure session creation and management
 * - Redirect handling: Automatic redirection after successful authentication
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {Request} context.request - The HTTP request containing form data
 * @param {Function} context.redirect - Function to handle redirects
 * @param {Object} context.cookies - Cookie management object
 * @param {string} context.request.formData.get('email') - User's email address
 * @param {string} context.request.formData.get('password') - User's password
 * @returns {Promise<Response>} A Response object for redirect or error message
 *
 * @example
 * // Request
 * POST /api/auth/signin
 * Content-Type: application/x-www-form-urlencoded
 *
 * email=user@example.com&password=securepassword
 *
 * // Success Response (302)
 * // Redirects to home page with set cookies
 *
 * // Error Response (400)
 * "Email and password are required"
 */

export const POST: APIRoute = rateLimit(
  async ({ request, redirect, cookies }) => {
    const formData = await request.formData()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error en el endpoint:', error)
      return new Response(error.message, { status: 400 })
    }
    const { access_token, refresh_token } = data.session
    cookies.set('sb-access-token', access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })
    cookies.set('sb-refresh-token', refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return redirect('/')
  }
)
