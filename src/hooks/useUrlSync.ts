import { useEffect, useRef } from 'react'
import { useSearchStoreResults } from '@store/search-results-store'

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
