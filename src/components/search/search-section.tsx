import '@styles/search-section.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import { SearchResultsErrorBoundary } from '@components/error-boundary'
import { FilterSection } from '@components/search/filters/filter-section'
import { SearchResults } from '@components/search/results/search-results'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useUrlSync } from '@hooks/useUrlSync'
import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'
import { baseUrl } from '@utils/base-url'
import { createFiltersToApply } from '@utils/filters-to-apply'
import type { AnimeCardInfo } from 'types'

/**
 * SearchComponent handles the anime search functionality with filters and results display.
 *
 * @description This component manages the search process by coordinating query input, filter application,
 * and results display. It debounces user queries to prevent excessive API calls and constructs
 * API URLs based on the current search parameters and applied filters.
 *
 * The component uses the search store to maintain state across the application, ensuring consistent
 * search behavior. It synchronizes the URL with the current search state for shareable links and
 * browser history support. The fetch operation is conditionally executed based on valid search criteria,
 * and loading states are properly managed to enhance user experience.
 *
 * The UI is organized into a grid layout with a filter section on one side and search results on the other,
 * providing an intuitive search interface. During data fetching, loading indicators are displayed to
 * provide visual feedback to users.
 *
 * The component updates the search results in the store when new data is received or when loading state
 * changes, ensuring that all parts of the application have access to the current search state.
 *
 * @returns {JSX.Element} The rendered search interface with filters and results sections
 *
 * @example
 * <SearchComponent client:visible />
 */
export const SearchComponent = () => {
  const {
    query,
    setResults,
    appliedFilters,
    setLoading,
    results,
    setIsLoadingMore,
    isLoadingMore,
  } = useSearchStoreResults()
  const { parentalControl } = useGlobalUserPreferences()
  const [page, setPage] = useState(4)
  const debouncedQuery = useDebounce(query, 600)
  const isFetching = useRef(false)
  const filtersToApply = useMemo(
    () => createFiltersToApply(appliedFilters),
    [appliedFilters]
  )
  const [isAllResults, setIsAllResults] = useState(false)
  const url = useMemo(() => {
    const baseQuery = `${baseUrl}/api/animes?limit_count=30&banners_filter=false&format=search&parental_control=${parentalControl}`
    const searchQuery = debouncedQuery ? `&search_query=${debouncedQuery}` : ''
    const filterQuery = filtersToApply ? `&${filtersToApply}` : ''
    return `${baseQuery}${searchQuery}${filterQuery}`
  }, [debouncedQuery, filtersToApply, parentalControl])

  const fetchMoreAnimes = async () => {
    if (isFetching.current) return
    isFetching.current = true
    setIsLoadingMore(true)
    const moreAnime = await fetch(
      `${url.replace('limit_count=30', 'limit_count=10')}&page_number=${page}`
    )
      .then((res) => res.json())
      .then((data) => data.data)

    if (!moreAnime || moreAnime.length === 0) {
      setIsAllResults(true)
      setIsLoadingMore(false)
      return
    }

    setResults([...(results ?? []), ...moreAnime], false, fetchError)
    setIsLoadingMore(false)
    setPage((prev) => prev + 1)
    isFetching.current = false
  }

  const handleScroll = async () => {
    const app = document.querySelector('#app')
    if (!app) return
    const appScrollTop = app.scrollTop
    const appClientHeight = app.clientHeight
    const appScrollHeight = app.scrollHeight

    if (
      appScrollTop + appClientHeight >= appScrollHeight - 300 &&
      !isLoadingMore &&
      !isAllResults &&
      !isFetching.current
    ) {
      await fetchMoreAnimes()
    }
  }
  const {
    data: animes,
    loading: isLoading,
    error: fetchError,
  } = useFetch<AnimeCardInfo[]>({
    url,
    skip: !url || (!filtersToApply && !debouncedQuery),
  })

  useUrlSync()
  useEffect(() => {
    const app = document.querySelector('#app')
    if (!app) return
    app.addEventListener('scroll', handleScroll)
    return () => {
      app.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, page])

  useEffect(() => {
   

    if (!isLoading) {
      setResults((animes ?? []), false, fetchError)
    }
  }, [animes, isLoading, fetchError, setResults, setLoading])

  return (
    <section id="search-section">
      <div className="[grid-area:aside]">
        <FilterSection />
      </div>

      <div className="mt-16 [grid-area:results]">
        <SearchResultsErrorBoundary>
          <SearchResults />
        </SearchResultsErrorBoundary>
      </div>
    </section>
  )
}
