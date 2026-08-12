import { TtlValues } from '@cache/types'
import { getRedisClient } from '@libs/redis'

/**
 * Cache repository backed by Redis.
 *
 * IMPORTANT: Redis is an optional infrastructure. This module must never
 * break request handling if Redis is unavailable. All Redis operations are
 * resolved lazily per call (no module-level connect) and failures degrade
 * gracefully to the caller instead of rejecting at import time.
 */

function invariant(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[CacheRepository] Redis unavailable:', ...args)
  }
}

export const cacheRepository = {
  async get(key: string): Promise<string | null> {
    try {
      const client = await getRedisClient()
      return await client.get(key)
    } catch (error) {
      invariant(error)
      return null
    }
  },
  async set(
    key: string,
    value: string,
    ttlSeconds: TtlValues = TtlValues.HOUR
  ): Promise<boolean> {
    try {
      const client = await getRedisClient()
      await client.setEx(key, ttlSeconds, value)
      return true
    } catch (error) {
      invariant(error)
      return false
    }
  },
  async delete(key: string): Promise<boolean> {
    try {
      const client = await getRedisClient()
      await client.del(key)
      return true
    } catch (error) {
      invariant(error)
      return false
    }
  },
  async exists(key: string): Promise<boolean> {
    try {
      const client = await getRedisClient()
      const exists = await client.exists(key)
      return exists === 1
    } catch (error) {
      invariant(error)
      return false
    }
  },
}
