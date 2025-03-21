/**
 * Converts a slug string to human-readable text by replacing hyphens with spaces.
 *
 * @description This utility function transforms URL-friendly slug strings into readable text format.
 * It replaces all hyphens with spaces, making the text more suitable for display purposes.
 * The function is commonly used when converting route parameters or URL segments into
 * display titles or headings in the user interface.
 *
 * The function handles any string input and performs a simple global replacement operation
 * without modifying any other characters or formatting. It preserves the case of the original
 * text and only targets hyphen characters.
 *
 * @param {string} slug - The hyphenated slug string to be converted to readable text
 * @returns {string} The converted string with spaces instead of hyphens
 *
 * @example
 * slugToText("attack-on-titan") // returns "attack on titan"
 */
export const slugToText = (slug: string) => {
  return slug.replace(/-/g, ' ')
}
