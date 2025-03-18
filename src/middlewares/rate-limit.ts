import type { APIContext } from 'astro'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
})

export const rateLimit =
  (handler: (context: APIContext) => Promise<Response>) =>
  async (context: APIContext): Promise<Response> => {
    try {
      await rateLimiter.consume(context.clientAddress)
      return await handler(context)
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
      })
    }
  }
