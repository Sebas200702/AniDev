import { createHash } from 'node:crypto'
import { cacheRepository } from '@cache/repositories'
import type { TtlValues } from '@cache/types'
import { createContextLogger } from '@libs/pino'
import { ensureRedisConnection } from '@libs/redis'

const logger = createContextLogger('CacheService')

export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const isActive = await ensureRedisConnection()
      if (!isActive) throw new Error('Redis connection is not active')
      const result = await cacheRepository.get(key)
      if (!result) return null
      return JSON.parse(result) as T
    } catch (error) {
      logger.error(`[CacheService.get] Error getting key "${key}":`, error)
      return null
    }
  },
  async set<T>(key: string, value: T, ttlSeconds: TtlValues): Promise<boolean> {
    try {
      const isActive = await ensureRedisConnection()
      if (!isActive) throw new Error('Redis connection is not active')
      await cacheRepository.set(key, JSON.stringify(value), ttlSeconds)
      return true
    } catch (error) {
      logger.error(`[CacheService.set] Error setting key "${key}":`, error)
      return false
    }
  },
  async delete(key: string): Promise<boolean> {
    try {
      const isActive = await ensureRedisConnection()
      if (!isActive) throw new Error('Redis connection is not active')
      await cacheRepository.delete(key)
      return true
    } catch (error) {
      logger.error(`[CacheService.delete] Error deleting key "${key}":`, error)
      return false
    }
  },
  async exists(key: string): Promise<boolean> {
    try {
      const isActive = await ensureRedisConnection()
      if (!isActive) throw new Error('Redis connection is not active')
      return await cacheRepository.exists(key)
    } catch (error) {
      logger.error(
        `[CacheService.exists] Error checking existence of key "${key}":`,
        error
      )
      return false
    }
  },
  generateKey(
    prefix: string,
    identifier: string | Record<string, any>
  ): string {
    if (typeof identifier === 'string') {
      return `${prefix}:${identifier}`
    }

    // Sort keys to ensure deterministic hash
    const ordered = Object.keys(identifier)
      .sort((a, b) => a.localeCompare(b))
      .reduce(
        (obj, key) => {
          obj[key] = identifier[key]
          return obj
        },
        {} as Record<string, any>
      )

    const str = JSON.stringify(ordered)
    const hash = createHash('sha256').update(str).digest('hex')
    return `${prefix}:${hash}`
  },
  async withBufferCache(
    key: string,
    fetchFunction: () => Promise<Buffer>,
    ttlSeconds: TtlValues
  ): Promise<Buffer> {
    // Try to get from cache
    const cached = await this.get<Buffer>(key)
    if (cached) {
      return cached
    }
    // Fetch fresh data
    const data = await fetchFunction()
    // Store in cache
    await this.set<Buffer>(key, data, ttlSeconds)
    return data
  },
}
