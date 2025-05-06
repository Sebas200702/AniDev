import { AnimeTypes } from 'types'

/**
 * typeColors function returns a Tailwind CSS color class based on the anime type.
 *
 * @description This function maps different anime types to specific color classes for visual distinction.
 * It provides a consistent color coding system across the application for different anime formats.
 * Each anime type (TV, OVA, Movie, etc.) is assigned a unique color to help users quickly identify
 * the format of an anime through visual cues.
 *
 * The function handles all standard anime types defined in the AnimeTypes enum and provides a
 * default color for any unrecognized types. This ensures that all anime entries have appropriate
 * styling regardless of their type classification.
 *
 * @param {string} type - The anime type to get a color class for
 * @returns {string} A Tailwind CSS color class corresponding to the anime type
 *
 * @example
 * <span className={typeColors(anime.type)}>{anime.type}</span>
 */
export const typeColors = (type: string) => {
  if (type === AnimeTypes.TV) return 'text-emerald-700 '
  if (type === AnimeTypes.OVA) return 'text-green-500 '
  if (type === AnimeTypes.MOVIE) return 'text-purple-500 '
  if (type === AnimeTypes.SPECIAL || type === AnimeTypes.TV_SPECIAL)
    return 'text-yellow-500 '
  if (type === AnimeTypes.ONA) return 'text-red-500 '
  if (type === AnimeTypes.PV) return 'text-orange-500 '
  if (type === AnimeTypes.CM) return 'text-indigo-600 '
  if (type === AnimeTypes.MUSIC) return 'text-pink-500 '

  return 'text-Primary-50'
}
