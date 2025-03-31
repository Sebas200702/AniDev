import type { APIContext } from 'astro'
import { getSession } from 'auth-astro/server'

/**
 * Middleware to check the session of the user.
 *
 * @param {Function} handler - The API handler function to be wrapped with session checking.
 * @returns {Function} A middleware-wrapped handler function with session validation applied.
 */
export const checkSession = (
  handler: (context: APIContext) => Promise<Response>
) => {
  return async (context: APIContext): Promise<Response> => {
    try {
      const session = await getSession(context.request)

      if (!session?.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      ;(context as any).session = session

      return handler(context)
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Error al verificar la sesión',
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}
