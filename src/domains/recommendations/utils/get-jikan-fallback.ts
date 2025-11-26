import { recommendationsRepository } from '@recommendations/repositories'
import type { JikanRecommendations } from '@recommendations/types'
import { shuffleArray } from '@utils/shuffle-array'

export async function getJikanFallback(
  jikan: JikanRecommendations | null | undefined,
  excludedIds: Set<number>,
  needed: number,
  parentalControl: boolean
) {
  if (!jikan?.mal_ids?.length) return []

  const ids = shuffleArray(
    jikan.mal_ids.filter((id) => !excludedIds.has(id))
  ).slice(0, needed)

  return recommendationsRepository.findByIds(ids, parentalControl)
}
