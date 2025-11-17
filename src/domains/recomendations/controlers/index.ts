// src/domains/recommendations/controllers/recommendations.controller.ts

import { recommendationsService } from '@recomendations/services'
import { buildContextFromUrl } from '@recomendations/utils/build-context'
import { getJikanBase } from '@recomendations/utils/get-jikan-base'
import { parseCookies } from '@recomendations/utils/parse-cookies'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { RecommendationContext } from 'domains/ai/types'

export const recommendationsController = {
  async getRecommendations(req: Request) {
    const url = new URL(req.url)
    const cookies = parseCookies(req)

    const userInfo = await getSessionUserInfo({
      request: req,
      accessToken: cookies['sb-access-token'],
      refreshToken: cookies['sb-refresh-token'],
    })

    const { userProfile, calculatedAge, error } =
      await recommendationsService.getUserPreferences(userInfo?.id ?? '')

    if (error || !userProfile || !calculatedAge) {
      throw new Error('User not found or invalid profile')
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

    if (!recommendations?.length) {
      console.warn(
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
