import { navigate } from 'astro:transitions/client'
import type { CharacterDetails } from '@character/types'

/**
 * Fetches character data based on the provided slug.
 *
 * @description This utility function retrieves character data from the API using the given slug.
 * It sends a request to the `/api/getCharacter` endpoint and attempts to fetch the corresponding
 * character information. If the API returns a 404 status, the user is redirected to a custom 404 page.
 * In case of any other errors, the function logs the error and returns `undefined`.
 *
 * The function is designed to handle API responses gracefully and ensure proper error handling
 * for scenarios where the requested character data is not found or an unexpected error occurs.
 *
 * @param {string} slug - The unique identifier (slug) of the character to fetch data for.
 * @returns {Promise<CharacterDetails | undefined>} A promise that resolves to the character data if found,
 * or `undefined` if an error occurs or the character is not found.
 *
 * @example
 * getCharacterData('momo-ayase_123456')
 *   .then((character) => logger.info(character))
 *   .catch((error) => console.error(error))
 */
export const getCharacterData = async (
  slug: string
): Promise<CharacterDetails | undefined> => {
  try {
    const response = await fetch(
      `/api/characters/getCharacter?slug=${slug}`,
      {}
    )

    if (response.status === 404) {
      navigate('/404')
    }

    const characterData = await response.json().then((data) => data.character)

    return characterData
  } catch (error) {
    console.error('Error fetching character data:', error)
    return
  }
}
