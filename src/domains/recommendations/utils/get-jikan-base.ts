import type { RecommendationContext } from 'domains/ai/types'
import { pickAnimeForJikan } from './pick-anime-for-jikan'

export async function getJikanBase(
  userProfile: any,
  context: RecommendationContext
) {
  if (!context.data.currentAnime?.mal_id || !context.data.currentAnime?.title) {
    return await pickAnimeForJikan(userProfile)
  }
  return {
    selectedFavoriteTitle: context.data.currentAnime.title,
    selectedFavoriteId: context.data.currentAnime.mal_id,
  }
}
