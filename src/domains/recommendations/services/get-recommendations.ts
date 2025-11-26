import { createContextLogger } from '@libs/pino'
import { recommendationsRepository } from '@recommendations/repositories'
import type { FetchRecommendationProps } from '@recommendations/types'
import {
  excludeCurrent,
  sanitizeIds,
} from '@recommendations/utils/filter-utils'
import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { shuffleArray } from '@utils/shuffle-array'
import { getAlternativeFallback, getJikanFallback } from './fallbacks'

const logger = createContextLogger('RecommendationsService')

export const getRecommendations = async ({
  mal_ids,
  parentalControl,
  jikanRecommendations,
  minResults,
  currentAnimeId,
}: FetchRecommendationProps): Promise<ApiResponse<any[]>> => {
  try {
    const numericIds = sanitizeIds(mal_ids)
    const excluded = new Set<number>()

    let results = await recommendationsRepository.findByIds(
      numericIds,
      parentalControl
    )
    results = excludeCurrent(results, currentAnimeId)

    for (const a of results) {
      excluded.add(a.mal_id)
    }
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

      for (const anime of fallback) {
        if (!excluded.has(anime.mal_id)) {
          results.push(anime)
          excluded.add(anime.mal_id)
        }
      }
    }

    if (results.length < minResults) {
      logger.warn(`Only found ${results.length}/${minResults} recommendations`)
    }

    return { data: shuffleArray(results) }
  } catch (error) {
    logger.error('[RecommendationsService.getRecommendations] Error:', {
      error,
    })
    if (isAppError(error)) {
      throw error
    }
    throw AppError.invalidState('Failed to fetch recommendations', {
      originalError: error,
    })
  }
}
