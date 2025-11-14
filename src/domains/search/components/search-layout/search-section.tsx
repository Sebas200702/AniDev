import '@search/styles/search-section.css'

import { useEffect, useRef, useState } from 'react'

import { AppliedFiltersComponent } from '@search/components/search-filters/applied-filters'
import { FilterSection } from '@search/components/search-filters/filter-section'
import { SearchHistoryModal } from '@search/components/search-history/search-history-modal'
import { SearchResults } from '@search/components/search-results/search-results'
import { SearchResultsErrorBoundary } from '@shared/components/ui/error-boundary'
import { SearchStats } from '@search/components/search-stats/search-stats'
import { useSearchStoreResults } from '@search/stores/search-results-store'
import { useUrlSync } from '@shared/hooks/useUrlSync'

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
 * Key features:
 * - Real-time URL synchronization with search parameters
 * - Advanced filtering system with multiple criteria
 * - Responsive grid layout for filters and results
 * - Error boundary for graceful error handling
 * - Loading state management
 * - Debounced search queries
 * - Shareable search URLs
 * - Search history tracking and display
 *
 * @returns {JSX.Element} The rendered search interface with filters and results sections
 *
 * @example
 * <SearchComponent client:visible />
 */
export const SearchComponent = () => {
  const {
    setResults,
    url,
    results,
    setIsLoadingMore,
    isLoadingMore,
    totalResults,
    setSearchHistoryIsOpen,
    searchHistoryIsOpen,
  } = useSearchStoreResults()

  const [page, setPage] = useState(4)

  const isFetching = useRef(false)

  const [isAllResults, setIsAllResults] = useState(false)

  const fetchMoreAnimes = async () => {
    if (isFetching.current) return
    isFetching.current = true
    setIsLoadingMore(true)
    const moreAnime = await fetch(
      `/api${url.replace('limit_count=30', 'limit_count=10')}&page_number=${page}`
    )
      .then((res) => res.json())
      .then((data) => data.data)

    if (!moreAnime || moreAnime.length === 0) {
      setIsAllResults(true)
      setIsLoadingMore(false)
      return
    }

    setResults([...(results ?? []), ...moreAnime], false, null)
    setIsLoadingMore(false)
    setPage((prev) => prev + 1)
    isFetching.current = false
  }

  const handleScroll = async () => {
    const app = document.getElementById('app')
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

  useUrlSync()
  useEffect(() => {
    const app = document.getElementById('app')
    if (!app) return
    app.addEventListener('scroll', handleScroll)
    return () => {
      app.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, page])

  useEffect(() => {
    const app = document.getElementById('app')
    if (!app) return
    app.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [url])

  return (
    <section id="search-section" className="w-full">
      <aside className="[grid-area:aside]">
        <FilterSection />
        <AppliedFiltersComponent />
        <SearchStats
          totalResults={totalResults}
          isLoadingMore={isLoadingMore}
          onHistoryClick={() => setSearchHistoryIsOpen(true)}
        />
      </aside>

      <main className="my-10 [grid-area:results] md:mt-16">
        <SearchResultsErrorBoundary>
          <SearchResults />
        </SearchResultsErrorBoundary>
      </main>

      <SearchHistoryModal
        isOpen={searchHistoryIsOpen}
        onClose={() => setSearchHistoryIsOpen(false)}
      />
    </section>
  )
}
