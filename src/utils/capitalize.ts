/**
 * Capitalize function takes a string and returns it with the first letter of each word capitalized.
 *
 * @description This function transforms a given string by capitalizing the first letter of each word
 * while preserving the rest of the characters in their original case. It works by splitting the input
 * string by spaces, processing each word individually, and then rejoining the words with spaces.
 *
 * The function handles multiple words separated by spaces and maintains the spacing between words.
 * It doesn't modify any characters other than the first letter of each word, preserving numbers,
 * special characters, and the case of non-initial letters in each word.
 *
 * @param {string} str - The string to capitalize
 * @returns {string} The string with the first letter of each word capitalized
 *
 * @example
 * capitalize("hello world") // Returns "Hello World"
 */
export const capitalize = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
