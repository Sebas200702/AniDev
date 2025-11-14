import type {
  FetchRecommendationProps,
  GenerateRecommendationsProps,
} from '@recomendations/types'
import { fetchRecomendations } from '@recomendations/utils/fetch-recomendations'
import { fetchJikanRecommendations } from '@recomendations/utils/get-jikan-recommendations'
import { generateContextualPrompt } from '@recomendations/utils/get-recomendation-context'
import { getUserDataToRecomendations } from '@recomendations/utils/get-user-data-to-recomendations'
import { generateUserRecomendations } from '@recomendations/utils/generate-recomenations'
import type { GeneratePromptProps } from 'domains/ai/types'

export const recommendationsService = {
  async getRecommendations(props: FetchRecommendationProps) {
    return fetchRecomendations(props)
  },

  async getUserPreferences(userId: string | null) {
    return getUserDataToRecomendations(userId)
  },

  async generatePrompt(props: GeneratePromptProps) {
    return generateContextualPrompt(props)
  },
  async generateRecommendations(props: GenerateRecommendationsProps) {
    return await generateUserRecomendations(props)
  },
  async getJikanRecommendations(mal_id: string) {
    return await fetchJikanRecommendations(mal_id)
  },
}
