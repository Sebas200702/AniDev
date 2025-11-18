import { RedisCacheService } from '@shared/services/redis-cache-service'

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string // Cache key prefix
}

/**
 * In-memory LRU cache for high-frequency requests (like image proxy)
 * Reduces Redis pressure for frequently accessed items
 */
class MemoryCache {
  private cache = new Map<string, { data: any; expiresAt: number }>()
  private maxSize = 500 // Increased to 500 - rely heavily on memory cache to avoid Redis

  set(key: string, data: any, ttlSeconds: number): void {
    // True LRU: delete existing key first to update its position
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Evict oldest (first) entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }

    // Insert at end (most recently used)
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    // True LRU: move accessed item to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }
}

const memoryCache = new MemoryCache()

/**
 * Cache utilities for API endpoints
 *
 * @description
 * Provides reusable cache operations for API endpoints using Redis.
 * Implements a consistent caching strategy across all endpoints.
 */

export const CacheUtils = {
  /**
   * Get data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    return await RedisCacheService.get<T>(key)
  },

  /**
   * Get buffer data from cache (for images/binary data)
   */
  async getBuffer(
    key: string
  ): Promise<{ buffer: Buffer; mimeType: string } | null> {
    try {
      const parsed = await RedisCacheService.get<any>(key)
      if (!parsed) return null

      // Defensive type checking
      if (!parsed || typeof parsed !== 'object') {
        console.error(
          '[CacheUtils.getBuffer] Invalid cached data: not an object'
        )
        return null
      }

      if (typeof parsed.buffer !== 'string') {
        console.error(
          '[CacheUtils.getBuffer] Invalid cached data: buffer is not a string'
        )
        return null
      }

      if (typeof parsed.mimeType !== 'string') {
        console.error(
          '[CacheUtils.getBuffer] Invalid cached data: mimeType is not a string'
        )
        return null
      }

      // Convert base64 string back to Buffer
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
    const { ttl = 3600 } = options
    await RedisCacheService.set(key, data, { ttl })
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

      // Skip Redis cache for very large buffers (> 5MB) - too slow
      if (data.buffer.length > 5 * 1024 * 1024) {
        console.warn(
          `[CacheUtils.setBuffer] Skipping Redis cache for large buffer: ${(data.buffer.length / 1024 / 1024).toFixed(2)}MB`
        )
        return
      }

      // Convert Buffer to base64 for compact JSON serialization
      const serializable = {
        buffer: data.buffer.toString('base64'),
        mimeType: data.mimeType,
      }
      await RedisCacheService.set(key, serializable, { ttl })
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
    const { ttl = 3600 } = options

    // Level 1: Check memory cache first (PRIMARY - fastest, no Redis needed)
    const memCached = memoryCache.get(key)
    if (memCached) {
      return memCached
    }

    // Level 2: Try Redis cache ONLY if connection available (SECONDARY - optional)
    // Skip Redis if it's causing problems - memory cache is sufficient
    try {
      const cached = await this.getBuffer(key)
      if (cached) {
        // Store in memory for next time
        memoryCache.set(key, cached, Math.min(ttl, 600)) // 10min in memory
        return cached
      }
    } catch {
      // Redis unavailable - not critical, continue without it
      console.warn('[Cache] Redis unavailable, using memory-only mode')
    }

    // Level 3: Execute function and cache result
    const data = await fetchFn()

    // ALWAYS store in memory cache (PRIMARY)
    memoryCache.set(key, data, Math.min(ttl, 600)) // 10min in memory

    // Optionally try to store in Redis (SECONDARY - fire & forget)
    this.setBuffer(key, data, options).catch(() => {
      // Silent fail - Redis is optional backup
    })

    return data
  },

  /**
   * Clear memory cache (useful for testing or memory management)
   */
  clearMemoryCache(): void {
    memoryCache.clear()
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
