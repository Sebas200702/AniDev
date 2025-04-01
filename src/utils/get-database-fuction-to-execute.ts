import { OrderFunctions } from 'types'

/**
 * Determines the appropriate database ordering function based on sort parameters.
 *
 * @description This utility function maps sort parameters to their corresponding database
 * ordering functions. It supports sorting by score and title, with both ascending and
 * descending order options. If no valid sort parameters are provided, it defaults to
 * sorting by score in descending order.
 *
 * The function is used to translate frontend sorting preferences into the appropriate
 * database query functions, ensuring consistent sorting behavior across the application.
 *
 * @param {string} orderby - The field to sort by ('score' or 'title')
 * @param {string} orderDirection - The sort direction ('asc' or 'desc')
 * @returns {OrderFunctions} The corresponding database ordering function
 *
 * @example
 * getFunctionToExecute('score', 'desc') // Returns OrderFunctions.score
 * getFunctionToExecute('title', 'asc') // Returns OrderFunctions.title_asc
 * getFunctionToExecute('invalid', 'desc') // Returns OrderFunctions.score (default)
 */
export const getFunctionToExecute = (
  orderby: string,
  orderDirection: string
) => {
  if (orderby === 'score') {
    return orderDirection === 'asc'
      ? OrderFunctions.score_asc
      : OrderFunctions.score
  }
  if (orderby === 'title') {
    return orderDirection === 'asc'
      ? OrderFunctions.title_asc
      : OrderFunctions.title
  }
  return OrderFunctions.score
}
