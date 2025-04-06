/**
 * statusColors function returns the appropriate CSS class for an anime's status.
 *
 * @description This function maps anime status strings to corresponding color classes.
 * It provides visual differentiation between different airing statuses through color coding.
 * The function handles four different status types with distinct color schemes: currently airing
 * (green), finished airing (blue), not yet aired (yellow), and unknown status (gray).
 *
 * Each color class includes both the base state and hover state styling for responsive design.
 * The hover effects are only applied on medium and larger screen sizes to enhance desktop user
 * experience while maintaining clean display on mobile devices.
 *
 * The function uses TypeScript's enum and type assertion to ensure type safety when accessing
 * the color values based on the provided status string.
 *
 * @param {string} status - The airing status of the anime
 * @returns {string} The CSS class string for the corresponding status color
 *
 * @example
 * const colorClass = statusColors("Currently Airing");
 * // Returns: "text-green-400 md:group-hover:text-green-500"
 */
export const statusColors = (status: string) => {
  enum COLORS {
    'Currently Airing' = 'text-green-400 md:group-hover:text-green-500',
    'Finished Airing' = 'text-blue-400 md:group-hover:text-blue-500',
    'Not yet aired' = 'text-yellow-400 md:group-hover:text-yellow-500',
    unknown = 'text-gray-400 md:group-hover:text-gray-500',
  }

  return COLORS[status as keyof typeof COLORS]
}
