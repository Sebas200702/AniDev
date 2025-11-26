import { generatePrompt } from '@recommendations/services/generate-prompt'
import { generateRecommendations } from '@recommendations/services/generate-recommendations'
import { getJikanRecommendations } from '@recommendations/services/get-jikan-recommendations'
import { getRecommendations } from '@recommendations/services/get-recommendations'
import { getUserPreferences } from '@recommendations/services/get-user-preferences'

export const recommendationsService = {
  getRecommendations,
  getUserPreferences,
  generatePrompt,
  generateRecommendations,
  getJikanRecommendations,
}
