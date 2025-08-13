import { safeRedisOperation } from '@libs/redis'

const BASE_KEY = 'gemini_quota_usage'
const LIMIT = 180

const getTodayKey = (base: string) =>
  `${base}:${new Date().toISOString().split('T')[0]}`

export class GeminiQuota {
  static async usage() {
    return (
      parseInt(
        (await safeRedisOperation((c) => c.get(getTodayKey(BASE_KEY)))) || '0'
      ) || 0
    )
  }

  static async canUse() {
    return (await this.usage()) < LIMIT
  }

  static async increment() {
    const key = getTodayKey(BASE_KEY)
    await safeRedisOperation((c) => c.incr(key))
    const reset = new Date()
    reset.setUTCDate(reset.getUTCDate() + 1)
    reset.setUTCHours(0, 0, 0, 0)
    await safeRedisOperation((c) =>
      c.expire(key, Math.floor((reset.getTime() - Date.now()) / 1000))
    )
  }
}
