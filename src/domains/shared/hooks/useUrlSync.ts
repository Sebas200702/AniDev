import { useEffect, useRef } from 'react'

import { useSearchStoreResults } from '@search/stores/search-results-store'

/**
 * useUrlSync is a custom hook that synchronizes the URL state with the search query and applied filters.
 *
 * @description This hook manages bidirectional synchronization between the application's search state
 * and the browser URL. It updates the URL when search parameters change and updates the store when
 * URL changes (like during navigation). The hook tracks query strings and filter parameters, encoding
 * them as URL search parameters for shareable and bookmarkable search states.
 *
 * The hook implements debouncing to prevent excessive URL history entries and handles the initial
 * mount by parsing existing URL parameters to restore previous search state. It properly handles
 * browser navigation events (back/forward) by listening to popstate events and updating the
 * application state accordingly.
 *
 * Filter values are serialized as comma-separated lists in URL parameters, allowing for multiple
 * selections within a single filter category. The hook maintains a reference to the last URL state
 * to prevent redundant history entries when the same search is performed multiple times.
 *
 * @returns {void} This hook doesn't return any values but affects URL and search store state
 *
 * @example
 * useUrlSync()
 */
export const useUrlSync = () => {
  const { query, appliedFilters, setQuery, setAppliedFilters } =
    useSearchStoreResults()
  const isInitialMount = useRef(true)
  const lastUrlState = useRef({ query: '', appliedFilters: {} })

  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const newQuery = searchParams.get('q') ?? ''
      const newFilters: Record<string, string[]> = {}

      searchParams.forEach((value, key) => {
        if (key !== 'q') {
          newFilters[key] = value.split(',')
        }
      })

      if (newQuery !== query) setQuery(newQuery)
      if (JSON.stringify(newFilters) !== JSON.stringify(appliedFilters)) {
        setAppliedFilters(newFilters)
      }
    }

    window.addEventListener('popstate', handlePopState)

    if (isInitialMount.current) {
      handlePopState()
      isInitialMount.current = false
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setQuery, setAppliedFilters, query, appliedFilters])

  useEffect(() => {
    if (!isInitialMount.current) {
      const searchParams = new URLSearchParams()
      if (query) {
        searchParams.set('q', query)
      }
      Object.entries(appliedFilters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          searchParams.set(key, values.join(','))
        }
      })

      const newUrlState = { query, appliedFilters }
      if (
        JSON.stringify(newUrlState) !== JSON.stringify(lastUrlState.current)
      ) {
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`

        window.history.pushState({ path: newUrl }, '', newUrl)
        lastUrlState.current = newUrlState
      }
    }
  }, [query, appliedFilters])
}
