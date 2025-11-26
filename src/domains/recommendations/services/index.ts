import type {
  FetchRecommendationProps,
  GenerateRecommendationsProps,
} from '@recommendations/types'
import { fetchRecommendations } from '@recommendations/utils/fetch-recommendations'
import { generateUserRecommendations } from '@recommendations/utils/generate-recomenations'
import { fetchJikanRecommendations } from '@recommendations/utils/get-jikan-recommendations'
import { generateContextualPrompt } from '@recommendations/utils/get-recomendation-context'
import { getUserDataToRecommendations } from '@recommendations/utils/get-user-data-to-recommendations'
import type { GeneratePromptProps } from 'domains/ai/types'

export const recommendationsService = {
  async getRecommendations(props: FetchRecommendationProps) {
    return fetchRecommendations(props)
  },

  async getUserPreferences(userId: string | null) {
    return getUserDataToRecommendations(userId)
  },

  async generatePrompt(props: GeneratePromptProps) {
    return generateContextualPrompt(props)
  },
  async generateRecommendations(props: GenerateRecommendationsProps) {
    return await generateUserRecommendations(props)
  },
  async getJikanRecommendations(mal_id: string) {
    return await fetchJikanRecommendations(mal_id)
  },
}
