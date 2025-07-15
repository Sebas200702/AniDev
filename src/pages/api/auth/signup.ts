import { supabase, supabaseAdmin } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import type { APIRoute } from 'astro'

/**
 * signup endpoint handles new user registration.
 *
 * @summary
 * An API endpoint that processes user registration using Supabase authentication.
 *
 * @description
 * This endpoint handles new user registration by creating a user account in Supabase.
 * It validates required fields, creates the user account with additional metadata,
 * automatically signs in the user, and sets secure HTTP-only cookies for session
 * management. The endpoint includes rate limiting to prevent abuse and implements
 * proper error handling for various registration scenarios.
 *
 * The endpoint creates a user with:
 * - Email and password authentication
 * - Username and empty avatar URL in metadata
 * - Automatic sign in after registration
 * - Secure session cookies for maintaining authentication state
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Input validation: Required fields checking
 * - User metadata: Stores additional user information
 * - Error handling: Comprehensive error handling
 * - Auto sign in: Automatically signs in user after registration
 * - Session cookies: Secure HTTP-only cookies for token storage
 * - Security: Password hashing handled by Supabase
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {Request} context.request - The HTTP request containing form data
 * @param {Object} context.cookies - Cookie management object
 * @returns {Promise<Response>} A Response object with session data and cookies
 *
 * @example
 * // Request
 * POST /api/auth/signup
 * Content-Type: application/x-www-form-urlencoded
 *
 * email=user@example.com&password=securepassword&user_name=username
 *
 * // Success Response (200)
 * {
 *   "session": { ... },
 *   "user": { ... }
 * }
 *
 * // Error Response (400)
 * "Email, password and username are required"
 */

export const POST: APIRoute = rateLimit(async ({ request, cookies }) => {
  const formData = await request.formData()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const user_name = formData.get('user_name') as string

  if (!email || !password || !user_name) {
    return new Response('Email, password and username are required', {
      status: 400,
    })
  }

  try {
    const { data: verifyData, error: verifyError } =
      await supabaseAdmin.auth.admin.generateLink({
        email,
        type: 'signup',
        password,
      })

    if (verifyError) {
      console.error('Error en la verificación:', verifyError.message)
      return new Response(JSON.stringify({ error: verifyError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name,
          avatar_url: '',
        },
      },
    })

    if (signUpError) {
      console.error('Error en el registro:', signUpError.message)
      return new Response(JSON.stringify({ error: signUpError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError) {
      console.error('Error en el inicio de sesión:', signInError.message)
      return new Response(JSON.stringify({ error: signInError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { access_token, refresh_token } = signInData.session
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

    return new Response(
      JSON.stringify({
        user: {
          name: signInData.user.user_metadata.user_name,
          avatar: signInData.user.user_metadata.avatar_url,
        },
        session: signInData.session,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error en el endpoint:', error)
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error en el servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
