import type { AnimeEpisode } from 'types'

interface Props {
  slug: string
  episodeNumber: number
}
/**
 * Fetches episode data for a given anime slug and episode number.
 *
 * @description This utility function retrieves episode data by making a request to the
 * `/api/getEpisode` endpoint. It constructs the API URL using the provided `slug` and
 * `episodeNumber` parameters. If the request is successful, it parses the response and
 * extracts the episode data. In case of an error, it logs the error to the console and
 * returns `null`.
 *
 * This function is useful for fetching specific episode details of an anime series
 * from the backend API, enabling dynamic content rendering based on user interaction.
 *
 * @param {Object} props - The input parameters for fetching episode data.
 * @param {string} props.slug - The unique identifier (slug) of the anime series.
 * @param {number} props.episodeNumber - The episode number to fetch data for.
 * @returns {Promise<AnimeEpisode | null>} A promise that resolves to the episode data
 * or `null` if an error occurs.
 *
 * @example
 * getEpisodeData({ slug: 'naruto', episodeNumber: 5 })
 * // Returns: { id: 5, title: 'The Fifth Episode', ... } or null if an error occurs.
 */
export const getEpisodeData = async ({ slug, episodeNumber }: Props) => {
  try {
    const response = await fetch(
      `/api/getEpisode?slug=${slug}&ep=${episodeNumber}`
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const episodeData: AnimeEpisode = await response
      .json()
      .then((data) => data.episode)

    return episodeData
  } catch (error) {
    console.error('Error fetching episode data:', error)
    return null
  }
}
