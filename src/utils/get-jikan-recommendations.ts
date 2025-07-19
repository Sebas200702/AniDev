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

/**
 * Fetches anime recommendations from the Jikan API for a specific anime.
 *
 * @description This function makes a request to the Jikan API to get official
 * recommendations for a specific anime using its MAL ID. It returns processed
 * recommendation data that can be used to guide the AI model in generating
 * better personalized recommendations.
 *
 * @param {string} malId - The MyAnimeList ID of the anime to get recommendations for
 * @returns {Promise<{mal_ids: number[], titles: string[], error?: string}>}
 * An object containing arrays of recommended anime IDs and titles, or an error message
 *
 * @example
 * const recommendations = await getJikanRecommendations('5114')
 * // Returns: { mal_ids: [1, 121, 820], titles: ['Cowboy Bebop', 'Fullmetal Alchemist', 'Ginga Eiyuu Densetsu'] }
 */
export const getJikanRecommendations = async (
  malId: string
): Promise<{
  mal_ids: number[]
  titles: string[]
  error?: string
}> => {
  try {
    console.log(`Fetching Jikan recommendations for anime ID: ${malId}`)

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

    console.log(
      `Successfully fetched ${mal_ids.length} recommendations from Jikan`
    )

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
