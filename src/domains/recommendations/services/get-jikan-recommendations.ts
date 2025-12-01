import { createContextLogger } from '@libs/pino'

const logger = createContextLogger('RecommendationsService')

export const getJikanRecommendations = async (
  mal_id: string
): Promise<{
  mal_ids: number[]
  titles: string[]
  error?: string
}> => {
  try {
    if (!mal_id) {
      return {
        mal_ids: [],
        titles: [],
        error: 'No MAL ID provided',
      }
    }

    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${mal_id}/recommendations`
    )

    if (!response.ok) {
      logger.error(`Jikan API error: ${response.status} ${response.statusText}`)
      return {
        mal_ids: [],
        titles: [],
        error: `Jikan API returned ${response.status}: ${response.statusText}`,
      }
    }

    const data: any = await response.json()

    if (!data.data || data.data.length === 0) {
      logger.warn(`No recommendations found for anime ID: ${mal_id}`)
      return {
        mal_ids: [],
        titles: [],
        error: 'No recommendations found for this anime',
      }
    }

    const sortedRecommendations = data.data
      .sort((a: any, b: any) => b.votes - a.votes)
      .slice(0, 20)

    const mal_ids = sortedRecommendations.map((rec: any) => rec.entry.mal_id)
    const titles = sortedRecommendations.map((rec: any) => rec.entry.title)

    return {
      mal_ids,
      titles,
      error: undefined,
    }
  } catch (error) {
    logger.error('[RecommendationsService.getJikanRecommendations] Error:', {
      error,
    })
    return {
      mal_ids: [],
      titles: [],
      error: `Failed to fetch Jikan recommendations: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}
