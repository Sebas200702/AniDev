import { AnimeFilters, NormalizedRating } from '@anime/types'
import { normalizeString } from '@utils/normalize-string'

/**
 * Checks if a string contains any numeric digits.
 *
 * @description This utility function uses a regular expression to test if a string
 * contains any numeric characters. It's used as a helper function to identify
 * year-related tags in the getFilterOfTag function.
 *
 * @param {string} str - The string to check for numeric content
 * @returns {boolean} True if the string contains at least one digit, false otherwise
 *
 * @example
 * haveNumbers("2023") // Returns true
 * haveNumbers("Action") // Returns false
 */
const haveNumbers = (str: string) => /\d/.test(str)

/**
 * getFilterOfTag determines the appropriate filter type based on the provided tag.
 *
 * @description
 * This utility function analyzes a given tag string and determines which type of anime filter
 * should be applied. It identifies several categories of tags:
 * - Media format tags (Anime, Special, OVA, ONA, Movie, Music) are mapped to type filters
 * - Four-digit numeric tags are recognized as year filters
 * - Tags containing rating indicators (+, -, R, G, E) are mapped to rating filters
 * - All other tags are assumed to be genre filters
 *
 * The function uses string pattern matching and character detection to categorize tags accurately.
 * This enables the application to generate appropriate filter URLs and query parameters when
 * users interact with tag elements throughout the interface.
 *
 * @param {string} tag - The tag to evaluate for filtering
 * @returns {AnimeFilters} The corresponding filter type for the tag
 *
 * @example
 * getFilterOfTag("OVA") // Returns AnimeFilters.Type
 * getFilterOfTag("2023") // Returns AnimeFilters.Year
 * getFilterOfTag("PG-13") // Returns AnimeFilters.Rating
 * getFilterOfTag("Action") // Returns AnimeFilters.Genre
 */
export const getFilterOfTag = (tag: string) => {
  if (tag === 'Anime') return AnimeFilters.Type
  if (tag === 'Special') return AnimeFilters.Type
  if (tag === 'OVA') return AnimeFilters.Type
  if (tag === 'ONA') return AnimeFilters.Type
  if (tag === 'Movie') return AnimeFilters.Type
  if (tag === 'Music') return AnimeFilters.Type
  if (haveNumbers(tag) && tag.length === 4) return AnimeFilters.Year

  if (
    Object.values(NormalizedRating)
      .map((rating) => normalizeString(rating))
      .includes(normalizeString(tag))
  ) {
    return AnimeFilters.Rating
  }

  return AnimeFilters.Genre
}
