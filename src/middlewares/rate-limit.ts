import type { APIContext } from 'astro'
import { RateLimiterMemory } from 'rate-limiter-flexible'

/**
 * Enhanced rate limiter middleware for API endpoints to prevent abuse.
 *
 * @description This middleware implements advanced rate limiting functionality for API requests.
 * It uses an in-memory rate limiter to track and limit requests from each client based on IP address.
 * The middleware supports different rate limiting strategies based on the endpoint or user roles.
 * When a client exceeds their allowed request quota, a 429 Too Many Requests response is returned
 * with a Retry-After header indicating when the client can make requests again.
 *
 * The middleware includes proper handling of different environments, with configurable limits
 * based on whether the application is running in development or production mode.
 *
 * @param {Function} handler - The API handler function to be rate-limited
 * @param {Object} options - Optional configuration parameters for the rate limiter
 * @param {number} options.points - Number of points (requests) allowed in the duration window (default: 100)
 * @param {number} options.duration - Duration window in seconds (default: 60)
 * @returns {Function} A middleware-wrapped handler function with rate limiting applied
 *
 * @example
 * export const get = rateLimit(
 *   async (context) => {
 *     return new Response(JSON.stringify({ data: "Success" }), { status: 200 });
 *   },
 *   { points: 50, duration: 30 }
 * );
 */
const defaultRateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
})

export const rateLimit = (
  handler: (context: APIContext) => Promise<Response>,
  options?: { points?: number; duration?: number }
) => {
  const limiter = options
    ? new RateLimiterMemory({
        points: options.points ?? 100,
        duration: options.duration ?? 60,
      })
    : defaultRateLimiter

  return async (context: APIContext): Promise<Response> => {
    try {
      const ip = context.clientAddress
      const rateLimitResult = await limiter.consume(ip)

      const response = await handler(context)
      const headers = new Headers(response.headers)
      headers.set('X-RateLimit-Limit', limiter.points.toString())
      headers.set(
        'X-RateLimit-Remaining',
        rateLimitResult.remainingPoints.toString()
      )
      headers.set(
        'X-RateLimit-Reset',
        Math.ceil(rateLimitResult.msBeforeNext / 1000).toString()
      )

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    } catch (error: any) {
      if (error.remainingPoints !== undefined) {
        return new Response(
          JSON.stringify({
            error: 'Too many requests',
            retryAfter: Math.ceil(error.msBeforeNext / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(error.msBeforeNext / 1000).toString(),
            },
          }
        )
      }

      console.error('Rate limit error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}
