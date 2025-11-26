import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
import { createContextLogger } from '@libs/pino'

const logger = createContextLogger('CacheUtils')

export const getCachedOrFetch = async <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options?: { ttl?: TtlValues }
): Promise<T> => {
  const cachedData = await CacheService.get<T>(key)
  if (cachedData !== null) {
    return cachedData
  }

  const freshData = await fetchFunction()

  CacheService.set(key, freshData, options?.ttl ?? TtlValues.HOUR).catch(
    (error) => {
      logger.error(`[getCachedOrFetch] Error caching key "${key}":`, error)
    }
  )

  return freshData
}
