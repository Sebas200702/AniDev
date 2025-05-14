/**
 * normalizeString function transforms a string by removing special characters and formatting it for URLs.
 *
 * @description This function processes a string to make it URL-friendly by removing special characters
 * and optionally replacing spaces with hyphens. It's particularly useful for creating slugs or clean URL paths
 * from titles or other text containing special characters, spaces, or punctuation.
 *
 * The function performs the following operations:
 * 1. Removes all special characters including punctuation marks and symbols
 * 2. Optionally replaces spaces with hyphens or removes them completely
 * 3. Optionally converts the string to lowercase
 *
 * This normalization is essential for creating consistent, readable URLs across the application
 * and is commonly used when generating links to anime details pages or other content.
 *
 * @param {string} str - The string to normalize
 * @param {boolean} [replaceSpace=true] - Whether to replace spaces with hyphens
 * @param {boolean} [removeSpace=true] - Whether to remove spaces completely (ignored if replaceSpace is true)
 * @param {boolean} [lowerCase=false] - Whether to convert the string to lowercase
 * @returns {string} The normalized string
 *
 * @example
 * normalizeString("My Hero Academia: Season 2") // returns "My-Hero-Academia-Season-2"
 * normalizeString("My Hero Academia: Season 2", false, false, false) // returns "My Hero Academia Season 2"
 * normalizeString("My Hero Academia: Season 2", false, true, true) // returns "myheroacademiaseason2"
 */
export const normalizeString = (
  str: string,
  replaceSpace: boolean = true,
  removeSpace: boolean = true,
  lowerCase: boolean = false
): string => {
  // Define the regex pattern for special characters once
  const specialCharsPattern = /[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g

  // Remove special characters
  let result = str.replace(specialCharsPattern, '')

  // Handle spaces based on parameters
  if (replaceSpace) {
    result = result.replace(/\s/g, '-')
  } else if (removeSpace) {
    result = result.replace(/\s/g, '')
  }

  // Convert to lowercase if requested
  return lowerCase ? result.toLowerCase() : result
}
