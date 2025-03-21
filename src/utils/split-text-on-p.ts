/**
 * splitTextOnP function splits a text string into two parts at a logical break point.
 *
 * @description This function divides a long text into two parts for better readability.
 * It attempts to find a natural break point near the middle of the text, preferably at the end
 * of a sentence (marked by a period). If the text is shorter than 400 characters, it returns
 * the original text as the first part and an empty string as the second part.
 *
 * The function first calculates the midpoint of the text and then searches for a period
 * before this midpoint to create a natural break. If no period is found before the midpoint,
 * it searches for one after the midpoint. If no suitable break point is found at all,
 * the function returns the entire text as the first part and an empty string as the second.
 *
 * This utility is particularly useful for formatting long descriptions or synopses into
 * more digestible paragraphs for improved user experience and visual presentation.
 *
 * @param {string} text - The text string to be split into two parts
 * @returns {string[]} An array containing two parts of the text: [part1, part2]
 *
 * @example
 * splitTextOnP("This is a long text. It contains multiple sentences. We want to split it.")
 */
export const splitTextOnP = (text: string) => {
  const midpoint = Math.floor(text.length / 2)
  if (text.length < 400) return [text, '']

  let splitPoint = text.lastIndexOf('.', midpoint)
  if (splitPoint === -1) {
    splitPoint = text.indexOf('.', midpoint)
  }

  if (splitPoint === -1) {
    return [text, '']
  }
  const part1 = text.slice(0, splitPoint + 1).trim()
  const part2 = text.slice(splitPoint + 1).trim()

  return [part1, part2]
}
