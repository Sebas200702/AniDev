import { HomeUrlBuilder } from '@recommendations/utils/home-url-builder'
import type { HomeSection } from '@shared/types/home-types'
import { HomeSlotStrategy } from '@shared/utils/home-slot-strategy'
import { HomeTitleGenerator } from '@shared/utils/home-title-generator'

const UrlResolver = {
  resolve: (slot: { value: string; type: string; filters?: any }) => {
    if (slot.value === 'recommendations') {
      return HomeUrlBuilder.buildRecommendationsUrl(24, slot.filters)
    }

    if (slot.filters) {
      return HomeUrlBuilder.buildComplexUrl({
        ...slot.filters,
        limit: 24,
      })
    }

    // Fallback for legacy or simple slots
    return HomeUrlBuilder.buildGenreUrl(slot.value, 24)
  },
}

export const HomeService = {
  generatePersonalizedContent: async (
    userProfile: any,
    calculatedAge: number
  ): Promise<HomeSection[]> => {
    const userGenres = userProfile.favorite_genres || []

    const selectedSlots = HomeSlotStrategy.selectSlotContent(
      userGenres,
      userProfile
    )

    const titles = await HomeTitleGenerator.generateCreativeTitles(
      selectedSlots,
      userGenres,
      calculatedAge ?? 18
    )

    return selectedSlots.map((slot, index) => ({
      title: titles[index] || slot.defaultTitle,
      url: UrlResolver.resolve(slot),
      urls: slot.values?.map((g: string) =>
        HomeUrlBuilder.buildGenreUrl(g, 24)
      ),
      titles: slot.values,
    })) as HomeSection[]
  },
}
