import type { Anime } from 'types'
import { create } from 'zustand'

interface SearchStoreResults {
  query: string
  error: string | null
  loading: boolean
  results: Anime[] | null
  setQuery: (query: string) => void
  setResults: (results: Anime[], loading: boolean, error: string | null) => void
  loadSearchResultsFromStorage: () => void
}

export const useSearchStoreResults = create<SearchStoreResults>((set) => ({
  query: '',
  error: null,
  loading: false,
  results: [],
  setQuery: (query) => set({ query }),

  setResults: (results, loading, error) => {
    if (results) {
      localStorage.setItem('searchResults', JSON.stringify(results))
    }
    set({ results, loading, error })
  },

  loadSearchResultsFromStorage: () => {
    const storedResults = localStorage.getItem('searchResults')
    if (storedResults) {
      set({ results: JSON.parse(storedResults), error: null, loading: false })
    }
  }
}))
