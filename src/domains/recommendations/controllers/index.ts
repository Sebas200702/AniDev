import { CacheService } from '@cache/services'
import { getCachedOrFetch } from '@cache/utils'
import { createLogger } from '@libs/logger'
import { recommendationsService } from '@recommendations/services'
import { buildContextFromUrl } from '@recommendations/utils/build-context'
import { getJikanBase } from '@recommendations/utils/get-jikan-base'
import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { AstroCookies } from 'astro'
import type { RecommendationContext } from 'domains/ai/types'

const logger = createLogger('RecommendationsController')

export const recommendationsController = {
  async getRecommendations(
    req: Request,
    cookies: AstroCookies
  ): Promise<ApiResponse<any[]>> {
    const url = new URL(req.url)

    const userInfo = await getSessionUserInfo({
      request: req,
      cookies,
    })

    const { userProfile, calculatedAge, error } =
      await recommendationsService.getUserPreferences(userInfo?.id ?? '')

    if (error || !userProfile || !calculatedAge) {
      throw AppError.validation('User not found or invalid profile')
    }

    const context: RecommendationContext = buildContextFromUrl(url)

    const { selectedFavoriteTitle, selectedFavoriteId } = await getJikanBase(
      userProfile,
      context
    )

    const jikanRecommendations =
      await recommendationsService.getJikanRecommendations(
        selectedFavoriteId?.toString() ?? ''
      )

    const prompt = await recommendationsService.generatePrompt({
      userProfile,
      calculatedAge,
      context,
      jikanRecommendations,
      favoriteAnime: selectedFavoriteTitle,
    })

    const cacheParams = {
      userId: userInfo?.id,
      contextType: context.type,
      searchQuery: context.data.searchQuery,
      currentAnime: context.data.currentAnime?.title,
      mood: context.data.mood,
      referenceAnime: context.data.referenceAnime,
      season: context.data.season,
      timeAvailable: context.data.timeAvailable,
      preferredLength: context.data.preferredLength,
      count: context.count,
      focus: context.focus,
      parentalControl: context.parentalControl,
    }

    const cacheKey = CacheService.generateKey('recommendations', cacheParams)

    const recommendations = await getCachedOrFetch(
      cacheKey,
      async () =>
        await recommendationsService.generateRecommendations({
          prompt,
          jikanRecommendations,
          context,
        })
    )

    if (!recommendations.length) {
      logger.warn(
        '[RecommendationsController] Gemini vacío, usando fallback Jikan'
      )
      const fallbackRecommendations =
        await recommendationsService.getRecommendations({
          mal_ids: [],
          minResults: context.count || 12,
          parentalControl: context.parentalControl || false,
        })
      return { data: fallbackRecommendations }
    }

    return { data: recommendations }
  },
}
