import { supabase } from '@libs/supabase'
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
 * and redirects to the sign-in page upon success. The endpoint includes rate limiting
 * to prevent abuse and implements proper error handling for various registration scenarios.
 *
 * The endpoint creates a user with:
 * - Email and password authentication
 * - Username and empty avatar URL in metadata
 * - Automatic redirection to sign-in page
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Input validation: Required fields checking
 * - User metadata: Stores additional user information
 * - Error handling: Comprehensive error handling
 * - Redirect handling: Automatic redirection after registration
 * - Security: Password hashing handled by Supabase
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {Request} context.request - The HTTP request containing form data
 * @param {Function} context.redirect - Function to handle redirects
 * @param {string} context.request.formData.get('email') - User's email address
 * @param {string} context.request.formData.get('password') - User's password
 * @param {string} context.request.formData.get('user_name') - User's display name
 * @returns {Promise<Response>} A Response object for redirect or error message
 *
 * @example
 * // Request
 * POST /api/auth/signup
 * Content-Type: application/x-www-form-urlencoded
 *
 * email=user@example.com&password=securepassword&user_name=username
 *
 * // Success Response (302)
 * // Redirects to /signin
 *
 * // Error Response (400)
 * "Email, password and username are required"
 */

export const POST: APIRoute = rateLimit(async ({ request, redirect }) => {
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name,
          avatar_url: '',
        },
      },
    })

    if (error) {
      console.error('Error en el endpoint:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
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

  return redirect('/signin')
})
