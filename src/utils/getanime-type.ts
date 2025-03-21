import { AnimeTypes } from 'types'

/**
 * Converts an anime type string to a standardized display format.
 *
 * @description
 * This utility function normalizes anime type strings to consistent, user-friendly formats.
 * It handles various anime media formats including TV series, movies, OVAs, and specials.
 * The function performs case-insensitive matching against known anime types defined in the
 * AnimeTypes enum and returns the appropriate standardized display name.
 *
 * If the input type is undefined or doesn't match any known type, it returns "Unknown".
 * This ensures consistent display of anime types throughout the application interface
 * regardless of how the source data formats the type strings.
 *
 * @param {string} [type] - The anime type string to normalize, can be undefined
 * @returns {string} The standardized display name for the anime type
 *
 * @example
 * getAnimeType("tv") // returns "Anime"
 * getAnimeType("MOVIE") // returns "Movie"
 * getAnimeType() // returns "Unknown"
 */
export const getAnimeType = (type?: string) => {
  if (!type) return 'Unknown'
  const typeNormalized = type.toLowerCase()

  if (typeNormalized === AnimeTypes.TV.toLowerCase()) return 'Anime'
  if (typeNormalized === AnimeTypes.OVA.toLowerCase()) return 'OVA'
  if (typeNormalized === AnimeTypes.MOVIE.toLowerCase()) return 'Movie'
  if (typeNormalized === AnimeTypes.SPECIAL.toLowerCase()) return 'Special'
  if (typeNormalized === AnimeTypes.ONA.toLowerCase()) return 'ONA'
  if (typeNormalized === AnimeTypes.TV_SPECIAL.toLowerCase()) return 'Special'
  if (typeNormalized === AnimeTypes.MUSIC.toLowerCase()) return 'Music'
  if (typeNormalized === AnimeTypes.PV.toLowerCase()) return 'PV'
  if (typeNormalized === AnimeTypes.CM.toLowerCase()) return 'CM'
  return 'Unknown'
}
