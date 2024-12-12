import { create } from 'zustand'
import type { Anime } from 'types'
interface SearchStoreResults {
  query: string
  error: string | null
  loading: boolean
  results: Anime[] | null
  setQuery: (query: string) => void
}

export const useSearchStoreResults = create<SearchStoreResults>((set) => ({
  query: '',
  error: null,
  loading: false,
  results: [],
  setQuery: (query) => set({ query }),
}))
