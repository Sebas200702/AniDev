import { redis, connectRedis } from '@libs/redis'
import { baseUrl } from '@utils/base-url'
import type { Anime } from 'types'

export const fetchAnimeData = async (query: string): Promise<Anime[]> => {
  if (!redis.isOpen) {
    await connectRedis()
  }
  const cachedData = await redis.get(query)

  if (cachedData) {
    return JSON.parse(cachedData)
  }

  const response = await fetch(
    `${baseUrl}/api/animes?${query}&limit_count=24`,
    { cache: 'force-cache' }
  )
  const data: { anime: Anime[] } = await response.json()
  await redis.set(query, JSON.stringify(data.anime), { EX: 3600 })

  return data.anime
}
