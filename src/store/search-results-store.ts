import { create } from 'zustand'

import type { Anime, AppliedFilters } from 'types'

interface SearchStoreResults {
  query: string
  error: string | null
  loading: boolean
  results: Anime[] | null
  appliedFilters: AppliedFilters
  setQuery: (query: string) => void
  setResults: (
    results: Anime[] | null,
    loading: boolean,
    error: string | null
  ) => void
  setAppliedFilters: (
    appliedFilters: AppliedFilters | ((prev: AppliedFilters) => AppliedFilters)
  ) => void
  resetFilters: () => void
  setLoading: (loading: boolean) => void
}

export const useSearchStoreResults = create<SearchStoreResults>((set) => ({
  query: '',
  error: null,
  loading: false,
  results: null,
  appliedFilters: {},

  setQuery: (query) => {
    set((state) => ({ ...state, query }))
  },

  setResults: (results, loading, error) => {
    set((state) => ({ ...state, results, loading, error }))
  },

  setAppliedFilters: (appliedFilters) => {
    set((state) => ({
      ...state,
      appliedFilters:
        typeof appliedFilters === 'function'
          ? appliedFilters(state.appliedFilters)
          : appliedFilters,
    }))
  },

  resetFilters: () => {
    set((state) => ({ ...state, appliedFilters: {} }))
  },

  setLoading: (loading) => {
    set((state) => ({ ...state, loading }))
  },
}))
