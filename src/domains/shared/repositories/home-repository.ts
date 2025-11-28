import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
import { HOME_CACHE_CONFIG } from '@shared/constants/home-constants'
import type { HomeSection } from '@shared/types/home-types'

export const HomeRepository = {
  cacheKeyFor: (userId: string | null) =>
    `${HOME_CACHE_CONFIG.REDIS_KEY_PREFIX}${userId ?? 'guest'}`,

  getCachedSections: async (
    userId: string | null
  ): Promise<HomeSection[] | null> => {
    const key = HomeRepository.cacheKeyFor(userId)
    return CacheService.get<HomeSection[]>(key)
  },

  setCachedSections: async (userId: string | null, sections: HomeSection[]) => {
    const key = HomeRepository.cacheKeyFor(userId)
    return CacheService.set(key, sections, TtlValues.DAY)
  },

  deleteCache: async (userId: string | null) => {
    const key = HomeRepository.cacheKeyFor(userId)
    return CacheService.delete(key)
  },
}
