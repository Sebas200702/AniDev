import { pickAnimeForJikan } from './pick-anime-for-jikan'
import type { RecommendationContext } from 'domains/ai/types'

export async function getJikanBase(userProfile: any, context: RecommendationContext) {
  if (!context.data.currentAnime) {
    return await pickAnimeForJikan(userProfile)
  }
  return {
    selectedFavoriteTitle: context.data.currentAnime.title,
    selectedFavoriteId: context.data.currentAnime.mal_id
  }
}
