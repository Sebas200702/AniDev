import { AnimeGenres } from '@anime/types'

/**
 * Maps anime genres to their corresponding Tailwind CSS color classes for hover effects.
 *
 * @description This utility function returns the appropriate Tailwind CSS class for a given anime genre.
 * It provides consistent color styling across the application by mapping each genre to a specific color.
 * The colors are applied as hover effects within group contexts, enhancing the interactive experience
 * while maintaining visual hierarchy and meaning through color association.
 *
 * The function handles all standard anime genres defined in the AnimeGenres enum, with each genre
 * receiving a distinct color that reflects its thematic elements. For example, action genres use
 * red tones while romance uses pink variants. If a genre is not explicitly mapped or is undefined,
 * the function returns a default gray color class.
 *
 * @param {string} genre - The anime genre to map to a color class
 * @returns {string} The Tailwind CSS class for the specified genre's hover effect
 *
 * @example
 * <span className={genreToColor('Action')}>Action</span>
 */
export const genreToColor = (genre: string) => {
  if (genre === AnimeGenres.ACTION) return 'md:group-hover:text-red-300'
  if (genre === AnimeGenres.ADVENTURE) return 'md:group-hover:text-enfasisColor'
  if (genre === AnimeGenres.GIRLS_LOVE) return 'md:group-hover:text-purple-300'
  if (genre === AnimeGenres.COMEDY) return 'md:group-hover:text-yellow-300'
  if (genre === AnimeGenres.DRAMA) return 'md:group-hover:text-purple-400'
  if (genre === AnimeGenres.ROMANCE) return 'md:group-hover:text-pink-300'
  if (genre === AnimeGenres.SCI_FI) return 'md:group-hover:text-indigo-300'
  if (genre === AnimeGenres.SLICE_OF_LIFE)
    return 'md:group-hover:text-green-300'
  if (genre === AnimeGenres.SPORTS) return 'md:group-hover:text-orange-300'
  if (genre === AnimeGenres.FANTASY) return 'md:group-hover:text-pink-400'
  if (genre === AnimeGenres.MYSTERY) return 'md:group-hover:text-yellow-200'
  if (genre === AnimeGenres.HORROR) return 'md:group-hover:text-red-400'
  return 'md:group-hover:text-gray-300'
}
