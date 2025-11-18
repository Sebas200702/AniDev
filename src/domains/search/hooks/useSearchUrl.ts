import type { AppliedFilters, SearchType } from '@search/types'
import { SearchUrlService } from '@search/services/search-url-service'
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
      SearchUrlService.buildUrl({
        type: currentType,
        query: debouncedQuery,
        filters: filtersToApply,
        parentalControl,
      }),
    [currentType, debouncedQuery, filtersToApply, parentalControl]
  )

  return { url, filtersToApply }
}
