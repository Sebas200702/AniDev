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

    const { userProfile, calculatedAge, error } =  await recommendationsService.getUserPreferences(userInfo?.id ?? '')

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

    const recommendations =
      await recommendationsService.generateRecommendations({
        prompt,
        jikanRecommendations,
        context,
      })

    if (!recommendations.data?.length) {
      logger.warn(
        '[RecommendationsController] Gemini vacío, usando fallback Jikan'
      )
      return await recommendationsService.getRecommendations({
        mal_ids: [],
        minResults: context.count || 12,
        parentalControl: context.parentalControl || false,
      })
    }

    return recommendations
  },
}
