/**
 * normalizeString function takes a string and normalizes it by removing special characters and replacing spaces with hyphens.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
export const normalizeString = (str: string) => {
  return str
    .replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
    .replace(/\s/g, '-')
}
