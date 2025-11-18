import { navigate } from 'astro:transitions/client'
import type { Anime } from '@anime/types'
import { api } from '@libs/api'

export interface AnimeResult {
  anime?: Anime
  blocked?: boolean
  message?: string
}

/**
 * Fetches anime data from the API.
 *
 * @description This utility function retrieves anime data from the getAnime API endpoint.
 * It sends a request and handles multiple scenarios:
 * - Returns anime data if found and accessible
 * - Returns blocked status if content is restricted by parental controls (403)
 * - Redirects to 404 page if anime doesn't exist (404)
 * - Logs errors for other unexpected cases
 *
 * The function is designed to handle API responses gracefully and ensure proper error handling
 * for all possible scenarios including parental control restrictions.
 *
 * @param {number} id - The MAL ID of the anime to fetch data for.
 * @param {boolean} parentalControl - Whether parental controls are enabled.
 * @returns {Promise<AnimeResult | undefined>} A promise that resolves to:
 * - `{ anime: Anime }` if the anime is found and accessible
 * - `{ blocked: true, message: string }` if the content is blocked by parental controls
 * - `undefined` if the anime is not found (triggers navigation to 404)
 *
 * @example
 * // Normal case - anime found
 * getAnimeData(21, false)
 *   .then((result) => {
 *     if (result?.anime) {
 *       console.log('Anime data:', result.anime)
 *     }
 *   })
 *
 * @example
 * // Parental control case - content blocked
 * getAnimeData(12345, true)
 *   .then((result) => {
 *     if (result?.blocked) {
 *       console.log('Blocked:', result.message)
 *     }
 *   })
 */
export const getAnimeData = async (
  id: number,
  parentalControl: boolean | null
): Promise<AnimeResult | undefined> => {
  try {
    const response = await api.get<
      Anime | { blocked: boolean; message: string } | { error: string }
    >(`/animes/getAnime?id=${id}&parentalControl=${parentalControl ?? true}`)

    // Anime no encontrado
    if (response.status === 404) {
      navigate('/404')
      return undefined
    }

    // Anime bloqueado por control parental
    if (response.status === 403 && response.data) {
      const data = response.data as { blocked: boolean; message: string }
      return {
        blocked: data.blocked,
        message: data.message,
      }
    }

    // Error de la API
    if (response.status !== 200 || !response.data) {
      console.error(`[getAnimeData] API error: ${response.status}`)
      return undefined
    }

    return { anime: response.data as Anime }
  } catch (error) {
    console.error('[getAnimeData] Error fetching anime:', error)
    return undefined
  }
}
