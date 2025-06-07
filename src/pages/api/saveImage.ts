import { supabase } from '@libs/supabase'
import { checkSession } from '@middlewares/auth'
import type { APIRoute } from 'astro'
import { getSessionUserInfo } from '@utils/get_session_user_info'

/**
 * saveImage endpoint updates a user's avatar URL in the database.
 *
 * @summary
 * An API endpoint that saves a user's avatar URL to their profile in the database.
 *
 * @description
 * This endpoint handles updating a user's avatar URL in the database after they
 * have uploaded a new profile picture. It requires authentication and validates
 * the user's session before allowing the update. The endpoint includes proper
 * error handling for various scenarios including unauthorized access and missing data.
 *
 * The endpoint uses Supabase's database to store the avatar URL and implements
 * proper session validation to ensure only authenticated users can update their
 * own avatars. It includes comprehensive error handling and proper response
 * formatting for both successful and error cases.
 *
 * @features
 * - Authentication: Requires valid user session
 * - Session validation: Verifies user identity
 * - Database update: Updates user profile in Supabase
 * - Error handling: Comprehensive error handling
 * - Response formatting: Consistent JSON response structure
 * - Security: Prevents unauthorized avatar updates
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {Request} context.request - The HTTP request containing avatar URL
 * @param {Object} context.request.json() - Request body containing avatar URL
 * @param {string} context.request.json() - The avatar URL to save
 * @returns {Promise<Response>} A Response object containing success message or error
 *
 * @example
 * // Request
 * POST /api/saveImage
 * Content-Type: application/json
 *
 * "https://ipfs.io/ipfs/Qm..."
 *
 * // Success Response (200)
 * {
 *   "message": "Avatar updated successfully",
 *   "data": { ... }
 * }
 *
 * // Error Response (401)
 * {
 *   "error": "Unauthorized"
 * }
 */

export const POST: APIRoute = checkSession(async ({ request, cookies }) => {
  const userInfo = await getSessionUserInfo({
    request,
    accessToken: cookies.get('sb-access-token')?.value,
    refreshToken: cookies.get('sb-refresh-token')?.value,
  })
  const user = userInfo?.name

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const body = await request.json()
  const avatar = body

  if (!avatar) {
    return new Response(JSON.stringify({ error: 'Avatar is required' }), {
      status: 400,
    })
  }

  const { data, error } = await supabase
    .from('public_users')
    .update({ avatar_url: avatar })
    .eq('name', user)



  if (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(
    JSON.stringify({ message: 'Avatar updated successfully', data }),
    {
      status: 200,
    }
  )
})
