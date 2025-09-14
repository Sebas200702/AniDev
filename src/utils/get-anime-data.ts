import { navigate } from 'astro:transitions/client'
import type { Anime } from '@anime/types'

export interface AnimeResult {
  anime?: Anime
  blocked?: boolean
  message?: string
}

/**
 * Fetches anime data based on the provided slug.
 *
 * @description This utility function retrieves anime data from the API using the given slug.
 * It sends a request to the `/api/getAnime` endpoint and attempts to fetch the corresponding
 * anime information. The function handles multiple scenarios:
 * - Returns anime data if found and accessible
 * - Returns blocked status if content is restricted by parental controls (403)
 * - Redirects to 404 page if anime doesn't exist (404)
 * - Logs errors for other unexpected cases
 *
 * The function is designed to handle API responses gracefully and ensure proper error handling
 * for all possible scenarios including parental control restrictions.
 *
 * @param {string} slug - The unique identifier (slug) of the anime to fetch data for.
 * @param {boolean} parentalControl - Whether parental controls are enabled.
 * @returns {Promise<AnimeResult | undefined>} A promise that resolves to:
 * - `{ anime: Anime }` if the anime is found and accessible
 * - `{ blocked: true, message: string }` if the content is blocked by parental controls
 * - `undefined` if an error occurs or the anime is not found
 *
 * @example
 * // Normal case - anime found
 * getAnimeData('naruto', false)
 *   .then((result) => {
 *     if (result?.anime) {
 *       console.log('Anime data:', result.anime)
 *     }
 *   })
 *
 * @example
 * // Parental control case - content blocked
 * getAnimeData('adult-anime', true)
 *   .then((result) => {
 *     if (result?.blocked) {
 *       console.log('Blocked:', result.message)
 *     }
 *   })
 */
export const getAnimeData = async (
  id: string,
  parentalControl: boolean | null
): Promise<AnimeResult | undefined> => {
  try {
    const response = await fetch(
      `/api/getAnime?id=${id}&parentalControl=${parentalControl}`
    )

    if (response.status === 404) {
      navigate('/404')
      return undefined
    }

    if (response.status === 403) {
      const data = await response.json()
      return {
        blocked: data.blocked,
        message: data.message,
      }
    }

    if (!response.ok) {
      console.error(`API error: ${response.status}`)
      return undefined
    }

    const data = await response.json()
    return { anime: data.data }
  } catch (error) {
    console.error('Error fetching anime data:', error)
    return undefined
  }
}
