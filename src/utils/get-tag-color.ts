/**
 * getTagColor returns the corresponding CSS class for a given anime tag type.
 *
 * @description This utility function determines the appropriate CSS styling for anime tags
 * based on their type. It maps each anime type to a specific color scheme that includes
 * background colors, hover effects, and text colors to provide visual distinction between
 * different types of anime content.
 *
 * The function uses an enum to define the mapping between anime types and their corresponding
 * CSS classes. If the provided type doesn't match any predefined types in the enum, it falls
 * back to a default styling with the emphasis color.
 *
 * Each color scheme is designed to be visually distinct while maintaining consistent styling
 * patterns across the application. The hover effects are included for interactive elements
 * and are responsive (applied only on medium screens and above).
 *
 * @param {string} type - The tag type to evaluate (e.g., 'Anime', 'Movie', 'OVA')
 * @returns {string} The CSS class string for styling the tag
 *
 * @example
 * const tagStyle = getTagColor('Movie');
 * // Returns: 'bg-purple-500 md:hover:bg-purple-400 text-white'
 */
export const getTagColor = (type: string) => {
  enum AnimeTags {
    Anime = 'bg-emerald-700 md:hover:bg-emerald-800 text-white',
    Special = 'bg-yellow-500 md:hover:bg-yellow-400 text-white',
    OVA = 'bg-green-500 md:hover:bg-green-400 text-white',
    ONA = 'bg-red-500 md:hover:bg-red-400 text-white',
    Movie = 'bg-purple-500 md:hover:bg-purple-400 text-white',
    Music = 'bg-pink-500 md:hover:bg-pink-400 text-white',
    Unknown = 'bg-gray-300 md:hover:bg-gray-400 text-gray-900',
    PV = 'bg-orange-500 md:hover:bg-orange-400 text-white',
    CM = 'bg-indigo-600 md:hover:bg-indigo-500 text-white',
  }

  const tagColor =
    AnimeTags[type as keyof typeof AnimeTags] ??
    'text-white bg-enfasisColor md:hover:bg-enfasisColor'

  return tagColor
}
