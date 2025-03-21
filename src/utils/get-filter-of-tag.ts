import { AnimeFilters } from 'types'

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
    tag.includes('+') ||
    tag.includes('-') ||
    tag.includes('R') ||
    tag.includes('G') ||
    tag.includes('E')
  )
    return AnimeFilters.Rating
  return AnimeFilters.Genre
}
