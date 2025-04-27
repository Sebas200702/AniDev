import type { Anime } from 'types'

/**
 * Fetches anime data based on the provided slug.
 *
 * @description This utility function retrieves anime data from the API using the given slug.
 * It sends a request to the `/api/getAnime` endpoint and attempts to fetch the corresponding
 * anime information. If the API returns a 404 status, the user is redirected to a custom 404 page.
 * In case of any other errors, the function logs the error and returns `undefined`.
 *
 * The function is designed to handle API responses gracefully and ensure proper error handling
 * for scenarios where the requested anime data is not found or an unexpected error occurs.
 *
 * @param {string} slug - The unique identifier (slug) of the anime to fetch data for.
 * @returns {Promise<Anime | undefined>} A promise that resolves to the anime data if found,
 * or `undefined` if an error occurs or the anime is not found.
 *
 * @example
 * getAnimeData('naruto')
 *   .then((anime) => console.log(anime))
 *   .catch((error) => console.error(error))
 */
export const getAnimeData = async (
  slug: string
): Promise<Anime | undefined> => {
  try {
    const response = await fetch(`/api/getAnime?slug=${slug}`, {
      cache: 'force-cache',
    })

    if (response.status === 404) {
      window.location.href = '/404'
    }

    const animeData = await response.json().then((data) => data.anime)

    return animeData
  } catch (error) {
    console.log(error)
    return
  }
}
