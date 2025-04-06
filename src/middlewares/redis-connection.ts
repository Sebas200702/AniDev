import { redis } from '@libs/redis'
import type { APIContext } from 'astro'

export const redisConnection = (
  handler: (context: APIContext) => Promise<Response>
) => {
  return async (context: APIContext): Promise<Response> => {
    if (!redis.isOpen) {
      await redis.connect()
    }
    return handler(context)
  }
}
