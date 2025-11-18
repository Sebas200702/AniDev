interface JikanRecommendation {
  entry: {
    mal_id: number
    title: string
    url: string
    images: {
      jpg: {
        image_url: string
        small_image_url: string
        large_image_url: string
      }
      webp: {
        image_url: string
        small_image_url: string
        large_image_url: string
      }
    }
  }
  votes: number
}

interface JikanRecommendationsResponse {
  data: JikanRecommendation[]
}

export const fetchJikanRecommendations = async (
  malId: string
): Promise<{
  mal_ids: number[]
  titles: string[]
  error?: string
}> => {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${malId}/recommendations`
    )

    if (!response.ok) {
      console.error(
        `Jikan API error: ${response.status} ${response.statusText}`
      )
      return {
        mal_ids: [],
        titles: [],
        error: `Jikan API returned ${response.status}: ${response.statusText}`,
      }
    }

    const data: JikanRecommendationsResponse = await response.json()

    if (!data.data || data.data.length === 0) {
      console.warn(`No recommendations found for anime ID: ${malId}`)
      return {
        mal_ids: [],
        titles: [],
        error: 'No recommendations found for this anime',
      }
    }

    const sortedRecommendations = data.data
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 20)

    const mal_ids = sortedRecommendations.map((rec) => rec.entry.mal_id)
    const titles = sortedRecommendations.map((rec) => rec.entry.title)

    return {
      mal_ids,
      titles,
      error: undefined,
    }
  } catch (error) {
    console.error('Error fetching Jikan recommendations:', error)
    return {
      mal_ids: [],
      titles: [],
      error: `Failed to fetch Jikan recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
