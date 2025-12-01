import type { AnimeCardInfo, AnimeDetail } from '@anime/types'
import type { Character } from '@character/types'
import type { AnimeSong } from '@music/types'
import {
  type AppliedFilters,
  type SearchHistory,
  SearchType,
} from '@search/types'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Results =
  | AnimeCardInfo[]
  | AnimeSong[]
  | Character[]
  | AnimeDetail[]
  | null
interface SearchStoreResults {
  query: string
  error: Error | null
  searchHistoryIsOpen: boolean
  url: string
  currentType: SearchType
  setCurrentType: (type: SearchType) => void
  loading: boolean
  completedSearch: boolean
  results: Results
  totalResults: number
  searchHistory: SearchHistory[]
  appliedFilters: AppliedFilters
  isLoadingMore: boolean
  setIsLoadingMore: (loadingMore: boolean) => void
  setQuery: (query: string) => void
  setResults: (
    results: AnimeCardInfo[] | null | AnimeSong[] | Character[] | AnimeDetail[],
    loading: boolean,
    error: Error | null
  ) => void
  setAppliedFilters: (
    appliedFilters: AppliedFilters | ((prev: AppliedFilters) => AppliedFilters)
  ) => void
  resetFilters: () => void
  setLoading: (loading: boolean) => void
  setCompletedSearch: (completedSearch: boolean) => void
  setTotalResults: (totalResults: number) => void
  setUrl: (url: string) => void
  addSearchHistory: (searchHistory: SearchHistory) => void
  setSearchHistory: (searchHistory: SearchHistory[]) => void
  setSearchHistoryIsOpen: (searchHistoryIsOpen: boolean) => void
  clearSearchHistory: () => void
}

export const useSearchStoreResults = create<SearchStoreResults>()(
  persist(
    (set) => ({
      query: '',
      error: null,

      searchHistoryIsOpen: false,
      currentType: SearchType.ANIMES,
      setCurrentType: (type) => {
        set({ currentType: type })
      },
      url: '',
      loading: false,
      completedSearch: false,
      results: null,
      totalResults: 0,
      searchHistory: [],
      appliedFilters: {},
      isLoadingMore: false,
      setCompletedSearch: (completedSearch) => {
        set((state) => ({ ...state, completedSearch }))
      },
      setIsLoadingMore: (isLoadingMore) => {
        set((state) => ({ ...state, isLoadingMore }))
      },

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
      setUrl(url) {
        set((state) => ({ ...state, url }))
      },
      setTotalResults: (totalResults) => {
        set((state) => ({ ...state, totalResults }))
      },
      addSearchHistory: (searchHistory) => {
        set((state) => {
          // Filter out duplicates
          const filteredHistory = state.searchHistory.filter(
            (item) =>
              !(
                item.query === searchHistory.query &&
                item.type === searchHistory.type &&
                JSON.stringify(item.appliedFilters) ===
                  JSON.stringify(searchHistory.appliedFilters)
              )
          )

          // Add new entry at the beginning and limit to 50 items
          const newHistory = [searchHistory, ...filteredHistory].slice(0, 50)

          return {
            ...state,
            searchHistory: newHistory,
          }
        })
      },
      setSearchHistoryIsOpen: (searchHistoryIsOpen) => {
        set((state) => ({ ...state, searchHistoryIsOpen }))
      },
      clearSearchHistory: () => {
        set((state) => ({ ...state, searchHistory: [] }))
      },
      setSearchHistory: (searchHistory) => {
        set((state) => ({ ...state, searchHistory }))
      },
    }),
    {
      name: 'search-store-results',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        query: state.query,
        currentType: state.currentType,
        searchHistory: state.searchHistory,
        appliedFilters: state.appliedFilters,
        url: state.url,
        totalResults: state.totalResults,
        completedSearch: state.completedSearch,
      }),
    }
  )
)
