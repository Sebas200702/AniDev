/**
 * formatScore function formats a numeric score to display with one decimal place.
 *
 * @description This function takes a numeric score value and formats it to consistently
 * display with one decimal place. It ensures that scores are presented in a uniform format
 * throughout the application, improving readability and user experience. The function
 * handles any numeric input and returns a string representation with exactly one digit
 * after the decimal point.
 *
 * The formatted score is commonly used in anime information displays, cards, and collection
 * items where consistent presentation of ratings is important for user comprehension. By
 * standardizing score display, the function helps maintain visual consistency across
 * different components and views in the application.
 *
 * @param {number} score - The numeric score value to format
 * @returns {string} The formatted score as a string with one decimal place
 *
 * @example
 * formatScore(8.67) // Returns "8.7"
 * formatScore(7) // Returns "7.0"
 */
export const formatScore = (score: number) => {
  return score.toFixed(1)
}
