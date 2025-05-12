/**
 * normalizeString function transforms a string by removing special characters and formatting it for URLs.
 *
 * @description This function processes a string to make it URL-friendly by removing special characters
 * and optionally replacing spaces with hyphens. It's particularly useful for creating slugs or clean URL paths
 * from titles or other text containing special characters, spaces, or punctuation.
 *
 * The function performs two main operations:
 * 1. Removes all special characters including punctuation marks and symbols
 * 2. Optionally replaces all whitespace characters with hyphens to create a URL-friendly format
 *
 * This normalization is essential for creating consistent, readable URLs across the application
 * and is commonly used when generating links to anime details pages or other content.
 *
 * @param {string} str - The string to normalize
 * @param {boolean} [removeSpace=true] - Whether to replace spaces with hyphens
 * @returns {string} The normalized string with special characters removed and optionally spaces replaced by hyphens
 *
 * @example
 * normalizeString("My Hero Academia: Season 2") // returns "My-Hero-Academia-Season-2"
 * normalizeString("My Hero Academia: Season 2", false) // returns "My Hero Academia Season 2"
 */
export const normalizeString = (str: string, removeSpace: boolean = true, lowerCase: boolean = false) => {
  if (removeSpace && lowerCase)
    return str
      .replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
      .replace(/\s/g, '-')
      .toLowerCase()

  if (removeSpace)
    return str.replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
      .replace(/\s/g, '-')

  if (lowerCase)
    return str.replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
      .toLowerCase()

  return str.replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
}
