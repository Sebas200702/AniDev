import type { AppliedFilters } from '@search/types'
import { useEffect } from 'react'

export const useSearchFilters = (
  currentType: string,
  setAppliedFilters: (filters: AppliedFilters) => void
) => {
  useEffect(() => {
    setAppliedFilters({})
  }, [currentType, setAppliedFilters])
}
