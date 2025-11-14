// src/domains/recommendations/controllers/recommendations.controller.ts

import { safeRedisOperation } from '@libs/redis'
import { recommendationsService } from '@recomendations/services'
import { buildContextFromUrl } from '@recomendations/utils/build-context'
import { getJikanBase } from '@recomendations/utils/get-jikan-base'
import { parseCookies } from '@recomendations/utils/parse-cookies'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { RecommendationContext } from 'domains/ai/types'

export const recommendationsController = {
  async getRecommendations(req: Request) {
    try {
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
        return new Response(
          JSON.stringify({ error: 'User not found or invalid profile' }),
          {
            status: 400,
          }
        )
      }

      const cacheKey = `recommendations:${userInfo?.id}:${url.searchParams.toString()}`
      const cached = await safeRedisOperation((c) => c.get(cacheKey))
      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        })
      }
      const context: RecommendationContext = buildContextFromUrl(url)

      const { selectedFavoriteTitle , selectedFavoriteId} = await getJikanBase(userProfile, context)
      const jikanRecommendations = await recommendationsService.getJikanRecommendations(selectedFavoriteId?.toString() ?? '')

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
        const fallback = await recommendationsService.getRecommendations({
          mal_ids: [],
          minResults: context.count || 12,
          parentalControl: context.parentalControl || false,
        })
        return new Response(JSON.stringify(fallback), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Source': 'Fallback',
          },
        })
      }

      const responseBody = JSON.stringify(recommendations)
      await safeRedisOperation((c) => c.set(cacheKey, responseBody)) // 1 hora

      return new Response(responseBody, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      })
    } catch (err) {
      console.error('[RecommendationsController] Error:', err)
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      })
    }
  },
}
