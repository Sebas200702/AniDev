import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIContext } from 'astro'

/**
 * Authentication middleware for API endpoints to ensure user session validity.
 *
 * @description This middleware implements session validation for protected API routes.
 * It checks for the presence of a valid user session using auth-astro's session management.
 * If no valid session is found, it returns a 401 Unauthorized response. For valid sessions,
 * it attaches the session object to the context for use in the route handler.
 *
 * The middleware includes proper error handling for both authentication failures and
 * server errors, returning appropriate HTTP status codes and JSON responses.
 *
 * @param {Function} handler - The API handler function to be protected with session validation
 * @returns {Function} A middleware-wrapped handler function with session validation applied
 *
 * @example
 * export const get = checkSession(
 *   async (context) => {
 *     // Access session data from context
 *     const { user } = context.session;
 *     return new Response(JSON.stringify({ data: "Protected data" }), { status: 200 });
 *   }
 * );
 */
export const checkSession = (
  handler: (context: APIContext) => Promise<Response>
) => {
  return async (context: APIContext): Promise<Response> => {
    try {
      const userInfo = await getSessionUserInfo({
        request: context.request,
        accessToken: context.cookies.get('sb-access-token')?.value,
        refreshToken: context.cookies.get('sb-refresh-token')?.value,
      })
      if (!userInfo) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      ;(context as any).locals.userInfo = userInfo
      return handler(context)
    } catch (error) {
      console.error('Error verifying session:', error)
      return new Response(
        JSON.stringify({
          error: 'An internal server error occurred',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}
