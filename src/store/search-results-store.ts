import type { Anime, AppliedFilters } from 'types'
import { create } from 'zustand'

interface SearchStoreResults {
  query: string
  error: string | null
  loading: boolean
  results: Anime[] | null
  appliedFilters: AppliedFilters
  setQuery: (query: string) => void
  setResults: (results: Anime[], loading: boolean, error: string | null) => void
  setAppliedFilters: (appliedFilters: AppliedFilters) => void
  resetFilters: () => void
}

export const useSearchStoreResults = create<SearchStoreResults>((set) => ({
  query: '',
  error: null,
  loading: false,
  results: [],
  appliedFilters: {},

  setQuery: (query) => set({ query }),

  setResults: (results, loading, error) => {
    set({ results, loading, error })
  },

  setAppliedFilters: (appliedFilters) => set({ appliedFilters }),

  resetFilters: () => set({ appliedFilters: {} }),
}))
