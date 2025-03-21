/**
 * Normalizes anime age ratings into a simplified format.
 *
 * @description This utility function converts various anime age rating formats into a standardized format.
 * It extracts the numeric age from rating strings (e.g., "PG-13", "R - 17+") and returns it with a plus sign,
 * indicating "suitable for ages X and above". If no numeric age is found in the rating string, it returns
 * 'E' as a default, representing content suitable for everyone.
 *
 * The function handles special cases like "G - All Ages" to return "E" (Everyone) and efficiently
 * extracts age numbers from various rating formats using regex pattern matching. This approach handles
 * diverse rating formats from different anime sources and standardizes them for consistent display
 * throughout the application.
 *
 * @param {string} rating - The original anime age rating string to normalize
 * @returns {string} The normalized rating in the format "X+" or "E" if no age is found
 *
 * @example
 * normalizeRating("PG-13") // Returns "13+"
 * normalizeRating("R - 17+") // Returns "17+"
 * normalizeRating("G - All Ages") // Returns "E"
 */
export const normalizeRating = (rating: string): string => {
  // Return early for common cases
  if (!rating || rating.includes('All Ages')) return 'E'

  const match = rating.match(/\d+/)
  return match ? `${match[0]}+` : 'E'
}
