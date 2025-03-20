import { AnimeFilters } from 'types'

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const haveNumbers = (str: string) => numbers.some((n) => str.includes(n))

/**
 * getFilterOfTag determines the appropriate filter type based on the provided tag.
 *
 * @param {string} tag - The tag to evaluate for filtering.
 * @returns {AnimeFilters} The corresponding filter type for the tag.
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
