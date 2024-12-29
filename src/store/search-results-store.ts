import { create } from 'zustand'
import type { Anime, AppliedFilters } from 'types'

interface SearchStoreResults {
  query: string
  error: string | null
  loading: boolean
  results: Anime[] | null
  appliedFilters: AppliedFilters
  setQuery: (query: string) => void
  setResults: (results: Anime[], loading: boolean, error: string | null) => void
  setAppliedFilters: (
    appliedFilters: AppliedFilters | ((prev: AppliedFilters) => AppliedFilters)
  ) => void
  resetFilters: () => void
}

export const useSearchStoreResults = create<SearchStoreResults>((set, get) => ({
  query: '',
  error: null,
  loading: false,
  results: [],
  appliedFilters: {},

  setQuery: (query) => {
    console.log('Setting query:', query)
    set({ query })
  },

  setResults: (results, loading, error) => {
    console.log('Setting results:', {
      resultsCount: results.length,
      loading,
      error,
    })
    set({ results, loading, error })
  },

  setAppliedFilters: (appliedFilters) => {
    console.log('Setting applied filters:', appliedFilters)
    set((state) => ({
      appliedFilters:
        typeof appliedFilters === 'function'
          ? appliedFilters(state.appliedFilters)
          : appliedFilters,
    }))
  },

  resetFilters: () => {
    console.log('Resetting filters')
    set({ appliedFilters: {} })
  },
}))
