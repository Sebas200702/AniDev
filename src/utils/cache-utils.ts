import { safeRedisOperation } from '@libs/redis'

/**
 * Cache utilities for API endpoints
 *
 * @description
 * Provides reusable cache operations for API endpoints using Redis.
 * Implements a consistent caching strategy across all endpoints.
 */

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string // Cache key prefix
}

export const CacheUtils = {
  /**
   * Get data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await safeRedisOperation((client) => client.get(key))
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('[CacheUtils.get] Error:', error)
      return null
    }
  },

  /**
   * Get buffer data from cache (for images/binary data)
   */
  async getBuffer(
    key: string
  ): Promise<{ buffer: Buffer; mimeType: string } | null> {
    try {
      const cached = await safeRedisOperation((client) => client.get(key))
      if (!cached) return null

      const parsed = JSON.parse(cached)
      if (!parsed?.buffer || !parsed?.mimeType) return null

      // Convert array back to Buffer
      return {
        buffer: Buffer.from(parsed.buffer, 'base64'),
        mimeType: parsed.mimeType,
      }
    } catch (error) {
      console.error('[CacheUtils.getBuffer] Error:', error)
      return null
    }
  },

  /**
   * Set data in cache
   */
  async set<T>(
    key: string,
    data: T,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const { ttl = 3600 } = options // Default 1 hour
      await safeRedisOperation((client) =>
        client.set(key, JSON.stringify(data), { EX: ttl })
      )
    } catch (error) {
      console.error('[CacheUtils.set] Error:', error)
    }
  },

  /**
   * Set buffer data in cache (for images/binary data)
   */
  async setBuffer(
    key: string,
    data: { buffer: Buffer; mimeType: string },
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const { ttl = 3600 } = options
      // Convert Buffer to array for JSON serialization
      const serializable = {
        buffer: Array.from(data.buffer),
        mimeType: data.mimeType,
      }
      await safeRedisOperation((client) =>
        client.set(key, JSON.stringify(serializable), { EX: ttl })
      )
    } catch (error) {
      console.error('[CacheUtils.setBuffer] Error:', error)
    }
  },

  /**
   * Generate cache key from URL search params
   */
  generateKey(prefix: string, params: URLSearchParams | string): string {
    return `${prefix}:${params.toString()}`
  },

  /**
   * Execute with cache (get from cache or execute function and cache result)
   */
  async withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key)
    if (cached) {
      return cached
    }

    // Execute function and cache result
    const data = await fetchFn()
    await this.set(key, data, options)

    return data
  },

  /**
   * Execute with buffer cache (for images/binary data)
   */
  async withBufferCache(
    key: string,
    fetchFn: () => Promise<{ buffer: Buffer; mimeType: string }>,
    options: CacheOptions = {}
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    // Try to get from cache
    const cached = await this.getBuffer(key)
    if (cached) {
      return cached
    }

    // Execute function and cache result
    const data = await fetchFn()
    await this.setBuffer(key, data, options)

    return data
  },
}

/**
 * Common TTL values
 */
export const CacheTTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 5 * 60,
  TEN_MINUTES: 10 * 60,
  THIRTY_MINUTES: 30 * 60,
  ONE_HOUR: 60 * 60,
  SIX_HOURS: 6 * 60 * 60,
  ONE_DAY: 24 * 60 * 60,
  ONE_WEEK: 7 * 24 * 60 * 60,
}
