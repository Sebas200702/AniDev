import { createContextLogger } from '@libs/pino'
import { recommendationsService } from '@recommendations/services'
import { STATIC_SECTIONS } from '@shared/constants/home-constants'
import type { ApiResponse } from '@shared/types/api-response'
import type { HomeSection } from '@shared/types/home-types'
import { HomeRepository } from '../repositories/home-repository'
import { HomeService } from '../services/home-service'

const logger = createContextLogger('HomeController')
// Keep same ordering definition used by the frontend layout
const DYNAMIC_SECTION_IDS = [
  'special-for-you',
  'top-2025',
  'collection-1',
  'banner-1',
  'slider-1',
  'slider-2',
  'banner-2',
  'slider-3',
  'collection-2',
  'banner-3',
  'slider-4',
]

export const HomeController = {
  // Public controller used by endpoints: handles cache and orchestration
  getHomeFeed: async (
    userId: string | null
  ): Promise<ApiResponse<HomeSection[]>> => {
    // 1. Try cache first
    const cached = await HomeRepository.getCachedSections(userId)
    if (cached)
      return {
        data: cached,
      }



    const { userProfile, calculatedAge } =
      await recommendationsService.getUserPreferences(userId)

    const personalizedContent = await HomeService.generatePersonalizedContent(
      userProfile,
      calculatedAge ?? 18
    )

    // 3. Merge with static sections
    const sections = STATIC_SECTIONS.map((section) => {
      const dynamicIndex = DYNAMIC_SECTION_IDS.indexOf(section.id)
      if (dynamicIndex === -1) return section
      const content = personalizedContent[dynamicIndex]
      if (!content) return section
      return {
        ...section,
        title: content.title,
        url: content.url,
        urls: content.urls,
        titles: content.titles,
      }
    })

    // 4. Cache and return
    await HomeRepository.setCachedSections(userId, sections)
    logger.info('Generated home feed via controller', { userId })
    return { data: sections }
  },

  invalidateCache: async (userId: string | null) => {
    await HomeRepository.deleteCache(userId)
    logger.info('Home feed cache invalidated', { userId })
  },

  regenerateHomeSections: async (userId: string | null) => {
    await HomeController.invalidateCache(userId)
    return HomeController.getHomeFeed(userId)
  },
}
