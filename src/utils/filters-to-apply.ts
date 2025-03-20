import type { AppliedFilters } from 'types'
import { normalizeString } from '@utils/normalize-string'

/**
 * createFiltersToApply generates a query string from applied filters for API requests.
 *
 * @param {AppliedFilters} appliedFilters - The applied filters to process.
 * @returns {string} The generated query string for the filters.
 */
export const createFiltersToApply = (appliedFilters: AppliedFilters) => {
  return Object.entries(appliedFilters)
    .filter(([_, values]) => values && values.length > 0)
    .map(([category, values]) => {
      return `${category}=${values.map((value) => normalizeString(value)).join('_')}`
    })
    .join('&')
}
