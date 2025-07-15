import { supabase } from '@libs/supabase'

/**
 * Gets MAL IDs for favorite anime titles by querying the database.
 *
 * @description This function takes an array of anime titles from the user's favorites
 * and queries the Supabase database to find matching anime records and their corresponding
 * MAL IDs. It handles title variations and normalization to improve match accuracy.
 *
 * @param {string[]} favoriteAnimeTitles - Array of anime titles from user's favorites
 * @returns {Promise<{mal_ids: number[], matchedTitles: string[], error?: string}>}
 * Object containing matched MAL IDs, titles, and potential error message
 *
 * @example
 * const result = await getFavoriteAnimeIds(['Naruto', 'One Piece', 'Attack on Titan'])
 * // Returns: { mal_ids: [20, 21, 16498], matchedTitles: ['Naruto', 'One Piece', 'Shingeki no Kyojin'] }
 */
export const getFavoriteAnimeIds = async (
  favoriteAnimeTitles: string[]
): Promise<{
  mal_ids: number[]
  matchedTitles: string[]
  error?: string
}> => {
  try {
    if (!favoriteAnimeTitles || favoriteAnimeTitles.length === 0) {
      return {
        mal_ids: [],
        matchedTitles: [],
        error: 'No favorite anime titles provided',
      }
    }

    console.log(
      `Searching for MAL IDs for favorite animes: ${favoriteAnimeTitles.join(', ')}`
    )

    // Primera consulta: búsqueda exacta por título
    const { data: exactMatches, error: exactError } = await supabase
      .from('anime')
      .select('mal_id, title')
      .in('title', favoriteAnimeTitles)

    if (exactError) {
      console.error('Error in exact title search:', exactError)
      return {
        mal_ids: [],
        matchedTitles: [],
        error: `Database error: ${exactError.message}`,
      }
    }

    let allMatches = exactMatches || []
    const foundTitles = new Set(allMatches.map((anime) => anime.title))
    const unmatchedTitles = favoriteAnimeTitles.filter(
      (title) => !foundTitles.has(title)
    )

    // Segunda consulta: búsqueda flexible para títulos no encontrados
    if (unmatchedTitles.length > 0) {
      console.log(`Doing flexible search for: ${unmatchedTitles.join(', ')}`)

      // Crear una query OR para búsqueda parcial usando ilike
      let flexibleQuery = supabase.from('anime').select('mal_id, title')

      // Construir condiciones OR para cada título no encontrado
      unmatchedTitles.forEach((title, index) => {
        const normalizedTitle = title.trim()
        if (index === 0) {
          flexibleQuery = flexibleQuery.ilike('title', `%${normalizedTitle}%`)
        } else {
          flexibleQuery = flexibleQuery.or(`title.ilike.%${normalizedTitle}%`)
        }
      })

      const { data: flexibleMatches, error: flexibleError } =
        await flexibleQuery.limit(20)

      if (flexibleError) {
        console.warn('Error in flexible title search:', flexibleError)
      } else if (flexibleMatches && flexibleMatches.length > 0) {
        // Filtrar duplicados y agregar matches flexibles
        const existingMalIds = new Set(allMatches.map((anime) => anime.mal_id))
        const newMatches = flexibleMatches.filter(
          (anime) => !existingMalIds.has(anime.mal_id)
        )
        allMatches = [...allMatches, ...newMatches]

        console.log(
          `Found ${newMatches.length} additional matches through flexible search`
        )
      }
    }

    const mal_ids = allMatches.map((anime) => anime.mal_id)
    const matchedTitles = allMatches.map((anime) => anime.title)

    console.log(
      `Successfully found ${mal_ids.length} MAL IDs for favorite animes`
    )

    return {
      mal_ids,
      matchedTitles,
      error: undefined,
    }
  } catch (error) {
    console.error('Error fetching favorite anime IDs:', error)
    return {
      mal_ids: [],
      matchedTitles: [],
      error: `Failed to fetch anime IDs: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
