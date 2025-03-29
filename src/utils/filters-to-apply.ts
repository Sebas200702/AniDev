import { normalizeString } from '@utils/normalize-string'
import type { AppliedFilters } from 'types'

/**
 * createFiltersToApply generates a query string from applied filters for API requests.
 *
 * @description This function processes a set of applied filters and converts them into a URL query string
 * format suitable for API requests. It filters out any empty filter categories, normalizes the filter
 * values to ensure consistent formatting, and joins multiple values within the same category using
 * underscores. The function ensures that only valid, non-empty filters are included in the final query.
 *
 * The function iterates through each filter category and its corresponding values, applying string
 * normalization to handle special characters and spaces. It then constructs a properly formatted
 * query parameter for each category, combining them with ampersands to create a complete query string.
 * This standardized format is essential for consistent API communication and request handling.
 *
 * @param {AppliedFilters} appliedFilters - The object containing filter categories and their selected values
 * @returns {string} The formatted query string ready to be appended to API endpoints
 *
 * @example
 * const filters = { genre: ['Action', 'Adventure'], year: ['2023'] };
 * createFiltersToApply(filters); // Returns "genre=action_adventure&year=2023"
 */
export const createFiltersToApply = (appliedFilters: AppliedFilters) => {
  return Object.entries(appliedFilters)
    .filter(([_, values]) => values && values.length > 0)
    .map(([category, values]) => {
      return `${category}=${values.map((value) => normalizeString(value, false)).join('_')}`
    })
    .join('&')
}
