import type { AppliedFilters } from 'types'
import { normalizeString } from '@utils/normalize-string'

export const createFiltersToApply = (appliedFilters: AppliedFilters) => {
  return Object.entries(appliedFilters)
    .filter(([_, values]) => values && values.length > 0)
    .map(([category, values]) => {
      return `${category}=${values.map((value) => normalizeString(value)).join('_')}`
    })
    .join('&')
}
