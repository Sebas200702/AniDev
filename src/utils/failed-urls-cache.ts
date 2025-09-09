import { safeRedisOperation } from '@libs/redis'

/**
 * Utility for managing failed URL combinations in Redis cache.
 *
 * @description This module provides functions to store and check URLs that have
 * returned 404 errors, preventing the system from generating the same failing
 * combinations repeatedly. It uses Redis with a TTL to allow URLs to be retried
 * after a certain period in case the data becomes available.
 */

const FAILED_URLS_KEY = 'failed-anime-urls'
const CACHE_TTL = 2592000 // 30 days in seconds

/**
 * Normalizes URL parameters to create a consistent cache key.
 *
 * @param {string} url - The URL query string to normalize
 * @returns {string} Normalized cache key
 */
const normalizeUrlKey = (url: string): string => {
  const params = new URLSearchParams(url)

  // Remove non-essential parameters that don't affect the core query
  params.delete('limit_count')
  params.delete('format')
  params.delete('banners_filter')

  // Sort parameters for consistent key generation
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return sortedParams
}

/**
 * Adds a failed URL to the Redis cache.
 *
 * @param {string} url - The URL query string that failed
 * @returns {Promise<void>}
 */
export const addFailedUrl = async (url: string): Promise<void> => {
  try {
    const normalizedKey = normalizeUrlKey(url)
    if (!normalizedKey) return // Skip empty keys

    await safeRedisOperation(async (redis) => {
      await redis.add(FAILED_URLS_KEY, normalizedKey)
      await redis.expire(FAILED_URLS_KEY, CACHE_TTL)
    })
  } catch (error) {
    console.error('Failed to add URL to failed cache:', error)
  }
}

/**
 * Checks if a URL combination is in the failed cache.
 *
 * @param {string} url - The URL query string to check
 * @returns {Promise<boolean>} True if the URL is known to fail
 */
export const isFailedUrl = async (url: string): Promise<boolean> => {
  try {
    const normalizedKey = normalizeUrlKey(url)
    if (!normalizedKey) return false

    const result = await safeRedisOperation(async (redis) => {
      return await redis.sismember(FAILED_URLS_KEY, normalizedKey)
    })

    return Boolean(result)
  } catch (error) {
    console.error('Failed to check failed URL cache:', error)
    return false
  }
}

/**
 * Gets the count of failed URLs in cache (for monitoring).
 *
 * @returns {Promise<number>} Number of failed URLs cached
 */
export const getFailedUrlsCount = async (): Promise<number> => {
  try {
    const result = await safeRedisOperation(async (redis) => {
      return await redis.scard(FAILED_URLS_KEY)
    })

    return result as number
  } catch (error) {
    console.error('Failed to get failed URLs count:', error)
    return 0
  }
}

/**
 * Clears all failed URLs from cache (for maintenance).
 *
 * @returns {Promise<void>}
 */
export const clearFailedUrls = async (): Promise<void> => {
  try {
    await safeRedisOperation(async (redis) => {
      await redis.del(FAILED_URLS_KEY)
    })
  } catch (error) {
    console.error('Failed to clear failed URLs cache:', error)
  }
}
