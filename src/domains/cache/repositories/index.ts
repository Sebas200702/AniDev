import { TtlValues } from '@cache/types'
import {  getRedisClient } from '@libs/redis'

const client = await getRedisClient()

export const cacheRepository = {
  async get(key: string): Promise<string | null> {
    return await client.get(key)
  },
  async set(
    key: string,
    value: string,
    ttlSeconds: TtlValues = TtlValues.HOUR
  ): Promise<void> {
    await client.setEx(key, ttlSeconds, value)
  },
  async delete(key: string): Promise<void> {
    await client.del(key)
  },
  async exists(key: string): Promise<boolean> {
    const exists = await client.exists(key)
    return exists === 1
  },
}
