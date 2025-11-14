import type { AppliedFilters, SearchHistory } from '@search/types'

import type { UserInfo } from '@user/types'
import { loadSearchHistory } from '@utils/load-search-history'
import { useEffect } from 'react'

export const useSearchHistory = (
  searchHistory: SearchHistory[],
  trackSearchHistory: boolean,
  query: string,
  appliedFilters: AppliedFilters,
  userInfo: UserInfo | null,
  setSearchHistory: (history: any[]) => void
) => {
  useEffect(() => {
    if (
      !searchHistory ||
      !trackSearchHistory ||
      (!query && Object.keys(appliedFilters).length === 0)
    )
      return

  }, [searchHistory, trackSearchHistory, query, appliedFilters, userInfo])

  // Cargar historial
  useEffect(() => {
    if (
      !trackSearchHistory ||
      (!query && Object.keys(appliedFilters).length === 0)
    )
      return
    loadSearchHistory(userInfo).then(setSearchHistory)
  }, [trackSearchHistory, query, appliedFilters, userInfo, setSearchHistory])
}
