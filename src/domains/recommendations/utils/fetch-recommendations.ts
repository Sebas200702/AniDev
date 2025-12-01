import {
  excludeCurrent,
  sanitizeIds,
} from '@recommendations/utils/filter-utils'

import { recommendationsRepository } from '@recommendations/repositories'
import type { FetchRecommendationProps } from '@recommendations/types'
import { getAlternativeFallback } from '@recommendations/utils/get-alternative-fallback'
import { getJikanFallback } from '@recommendations/utils/get-jikan-fallback'
import { shuffleArray } from '@utils/shuffle-array'

export const fetchRecommendations = async ({
  mal_ids,
  parentalControl,
  jikanRecommendations,
  minResults,
  currentAnimeId,
}: FetchRecommendationProps) => {
  const numericIds = sanitizeIds(mal_ids)
  const excluded = new Set<number>()

  let results = await recommendationsRepository.findByIds(
    numericIds,
    parentalControl
  )
  results = excludeCurrent(results, currentAnimeId)

  results.forEach((a) => excluded.add(a.mal_id))
  if (currentAnimeId) excluded.add(Number(currentAnimeId))

  if (results.length < minResults) {
    const needed = minResults - results.length
    let fallback = await getJikanFallback(
      jikanRecommendations,
      excluded,
      needed,
      parentalControl
    )

    if (fallback.length < needed) {
      const stillNeeded = needed - fallback.length
      const alt = await getAlternativeFallback(
        excluded,
        stillNeeded,
        parentalControl
      )
      fallback = [...fallback, ...alt]
    }

    fallback.forEach((anime) => {
      if (!excluded.has(anime.mal_id)) {
        results.push(anime)
        excluded.add(anime.mal_id)
      }
    })
  }

  if (results.length < minResults) {
    console.warn(`Only found ${results.length}/${minResults} recommendations`)
  }

  return shuffleArray(results)
}
