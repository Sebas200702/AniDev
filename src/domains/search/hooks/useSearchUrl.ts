import type { AppliedFilters, SearchType } from '@search/types'
import { buildSearchUrl } from '@search/utils/search-bar'
import { createFiltersToApply } from '@utils/filters-to-apply'
import { useMemo } from 'react'

export const useSearchUrl = (
  currentType: SearchType,
  debouncedQuery: string,
  appliedFilters: AppliedFilters,
  parentalControl: boolean | null
) => {
  const filtersToApply = useMemo(
    () => createFiltersToApply(appliedFilters) || null,
    [appliedFilters]
  )

  const url = useMemo(
    () =>
      buildSearchUrl(
        currentType,
        debouncedQuery,
        filtersToApply,
        parentalControl
      ),
    [currentType, debouncedQuery, filtersToApply, parentalControl]
  )

  return { url, filtersToApply }
}
