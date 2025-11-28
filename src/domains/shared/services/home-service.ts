import { HomeSlotStrategy } from '@shared/utils/home-slot-strategy'
import { HomeTitleGenerator } from '@shared/utils/home-title-generator'
import { HomeUrlBuilder } from '@recommendations/utils/home-url-builder'
import { TYPE_BANK } from '@shared/constants/home-constants'
import type { HomeSection } from '@shared/types/home-types'

export const HomeService = {
  // Generate personalized sections WITHOUT doing any caching
  generatePersonalizedContent: async (
    userProfile: any,
    calculatedAge: number
  ): Promise<HomeSection[]> => {
 
    const selectedSlots = HomeSlotStrategy.selectSlotContent(
      userProfile.favorite_genres || [],
      userProfile
    )

    // 2. Generate titles
    const titles = await HomeTitleGenerator.generateCreativeTitles(
      selectedSlots,
      userProfile.favorite_genres || [],
      calculatedAge ?? 18
    )


    return selectedSlots.map((slot, index) => ({
      title: titles[index] || slot.defaultTitle,
      url: HomeService.buildUrl(slot),
      urls: slot.values?.map((g: string) =>
        HomeUrlBuilder.buildGenreUrl(g, 24)
      ),
      titles: slot.values,
    })) as HomeSection[]
  },

  buildUrl: (slot: { value: string; type: string; filters?: any }) => {
    if (slot.value === 'recommendations')
      return HomeUrlBuilder.buildRecommendationsUrl(24, {
        mood: slot.filters?.mood,
        focus: slot.filters?.focus,
        referenceAnime: slot.filters?.referenceAnime,
      })

    if (slot.filters) {
      return HomeUrlBuilder.buildComplexUrl({
        ...slot.filters,
        limit: 24,
      })
    }

    if (slot.value === '2025') return HomeUrlBuilder.buildYearUrl(2025, 'TV')
    if (TYPE_BANK.includes(slot.value as any))
      return HomeUrlBuilder.buildTypeUrl(slot.value)
    if (slot.type === 'banner')
      return HomeUrlBuilder.buildGenreUrl(slot.value, 1, true)
    return HomeUrlBuilder.buildGenreUrl(slot.value, 24)
  },
}
