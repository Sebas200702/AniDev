import type { AnimeCardInfo, AnimeDetail } from '@anime/types'
import type { Character } from '@character/types'
import type { AnimeSongWithImage } from '@music/types'
import { type AppliedFilters, SearchType } from '@search/types'
import type { SearchHistory } from '@user/types'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * SearchStoreResults provides state management for anime search functionality.
 *
 * @description This store manages the state for the search feature, including query text, results,
 * loading states, and filter applications. It centralizes search-related data and operations to
 * ensure consistency across components that interact with search functionality.
 *
 * The store maintains several key pieces of state:
 * - Query string that represents the user's search input
 * - Results array containing matching anime data
 * - Loading state to track ongoing search operations
 * - Error state for handling failed requests
 * - Applied filters object containing active search filters
 *
 * The store provides methods to update these states, including specialized functions for
 * setting queries, managing results, applying filters, and controlling loading indicators.
 * The filter management includes support for both direct object assignment and functional
 * updates for complex state transitions.
 *
 * @interface SearchStoreResults
 * @property {string} query - Current search query text
 * @property {string|null} error - Error message if search request failed
 * @property {boolean} loading - Flag indicating if search is in progress
 * @property {Anime[]|null} results - Array of anime matching the search criteria
 * @property {AppliedFilters} appliedFilters - Object containing active search filters
 * @property {Function} setQuery - Updates the search query text
 * @property {Function} setResults - Updates search results, loading state, and error state
 * @property {Function} setAppliedFilters - Updates the applied filters
 * @property {Function} resetFilters - Clears all applied filters
 * @property {Function} setLoading - Sets the loading state
 *
 * @example
 * const { query, results, loading, setQuery, setAppliedFilters } = useSearchStoreResults();
 * setQuery('dragon ball');
 * setAppliedFilters({ genre: 'action' });
 */

interface SearchStoreResults {
  query: string
  error: string | null
  searchHistoryIsOpen: boolean
  url: string
  currentType: SearchType
  setCurrentType: (type: SearchType) => void
  loading: boolean
  completedSearch: boolean
  results:
    | AnimeCardInfo[]
    | null
    | AnimeSongWithImage[]
    | Character[]
    | AnimeDetail[]
  totalResults: number
  searchHistory: SearchHistory[]
  appliedFilters: AppliedFilters
  isLoadingMore: boolean
  setIsLoadingMore: (loadingMore: boolean) => void
  setQuery: (query: string) => void
  setResults: (
    results:
      | AnimeCardInfo[]
      | null
      | AnimeSongWithImage[]
      | Character[]
      | AnimeDetail[],
    loading: boolean,
    error: string | null
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
          const filteredHistory = state.searchHistory.filter(
            (item) =>
              !(
                item.query === searchHistory.query &&
                JSON.stringify(item.appliedFilters) ===
                  JSON.stringify(searchHistory.appliedFilters)
              )
          )

          const newHistory = [searchHistory, ...filteredHistory]

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
