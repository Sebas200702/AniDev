import { getRedisClient } from '@libs/redis'

/**
 * Redis Cache Service
 * Orchestrates all cache operations with proper error handling
 */

interface CacheOptions {
  ttl?: number // Time to live in seconds
}

export const RedisCacheService = {
  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await getRedisClient()
      const value = await client.get(key)

      if (!value) return null

      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Redis GET error for key "${key}":`, error)
      return null
    }
  },

  /**
   * Set a value in cache
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    try {
      const client = await getRedisClient()
      const serialized = JSON.stringify(value)

      if (options?.ttl) {
        await client.setEx(key, options.ttl, serialized)
      } else {
        await client.set(key, serialized)
      }

      return true
    } catch (error) {
      console.error(`Redis SET error for key "${key}":`, error)
      return false
    }
  },

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const client = await getRedisClient()
      await client.del(key)
      return true
    } catch (error) {
      console.error(`Redis DELETE error for key "${key}":`, error)
      return false
    }
  },

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const client = await getRedisClient()
      const result = await client.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Redis EXISTS error for key "${key}":`, error)
      return false
    }
  },

  /**
   * Get or set pattern: try to get from cache, if not found execute callback and cache result
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T | null> {
    // Try to get from cache first
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Not in cache, execute callback
    try {
      const result = await callback()

      // Cache the result
      await this.set(key, result, options)

      return result
    } catch (error) {
      console.error(`Error in getOrSet for key "${key}":`, error)
      return null
    }
  },

  /**
   * Delete keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const client = await getRedisClient()
      const keys = await client.keys(pattern)

      if (keys.length === 0) return 0

      await client.del(keys)
      return keys.length
    } catch (error) {
      console.error(`Redis DELETE PATTERN error for "${pattern}":`, error)
      return 0
    }
  },

  /**
   * Get multiple values at once
   */
  async mGet<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const client = await getRedisClient()
      const values = await client.mGet(keys)

      return values.map((value) => {
        if (!value) return null
        try {
          return JSON.parse(value) as T
        } catch {
          return null
        }
      })
    } catch (error) {
      console.error('Redis MGET error:', error)
      return keys.map(() => null)
    }
  },

  /**
   * Set multiple values at once
   */
  async mSet(entries: Record<string, any>): Promise<boolean> {
    try {
      const client = await getRedisClient()
      const serializedEntries: Record<string, string> = {}

      for (const [key, value] of Object.entries(entries)) {
        serializedEntries[key] = JSON.stringify(value)
      }

      await client.mSet(serializedEntries)
      return true
    } catch (error) {
      console.error('Redis MSET error:', error)
      return false
    }
  },

  /**
   * Increment a counter
   */
  async increment(key: string, by: number = 1): Promise<number | null> {
    try {
      const client = await getRedisClient()
      return await client.incrBy(key, by)
    } catch (error) {
      console.error(`Redis INCREMENT error for key "${key}":`, error)
      return null
    }
  },

  /**
   * Set expiration on a key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const client = await getRedisClient()
      await client.expire(key, seconds)
      return true
    } catch (error) {
      console.error(`Redis EXPIRE error for key "${key}":`, error)
      return false
    }
  },

  /**
   * Ping Redis to check connection
   */
  async ping(): Promise<boolean> {
    try {
      const client = await getRedisClient()
      const result = await client.ping()
      return result === 'PONG'
    } catch (error) {
      console.error('Redis PING error:', error)
      return false
    }
  },
}
