import { useEffect, useMemo } from "react"

import type { Anime } from "types"
import { FilterSection } from "@components/search/filters/filter-section"
import { SearchResults } from "@components/search/results/search-results"
import { baseUrl } from "@utils/base-url"
import { createFiltersToApply } from "@utils/filters-to-apply"
import { useDebounce } from "@hooks/useDebounce"
import { useFetch } from "@hooks/useFetch"
import { useSearchStoreResults } from "@store/search-results-store"
import { useUrlSync } from "@hooks/useUrlSync"

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
  const { query, setResults, appliedFilters, setLoading } =
    useSearchStoreResults()
  const debouncedQuery = useDebounce(query, 500)
  const filtersToApply = useMemo(
    () => createFiltersToApply(appliedFilters),
    [appliedFilters]
  )
  const url = useMemo(() => {
    const baseQuery = `${baseUrl}/api/animes?limit_count=60&banners_filter=false`
    const searchQuery = debouncedQuery ? `&search_query=${debouncedQuery}` : ''
    const filterQuery = filtersToApply ? `&${filtersToApply}` : ''
    return `${baseQuery}${searchQuery}${filterQuery}`
  }, [debouncedQuery, filtersToApply])

  const {
    data: animes,
    loading: isLoading,
    error: fetchError,
  } = useFetch<Anime[]>({
    url,
    skip: !url || (!filtersToApply && !debouncedQuery),
  })

  useUrlSync()

  useEffect(() => {
    setLoading(isLoading)
    if (!isLoading) {
      setResults(animes ?? [], false, fetchError)
    }
  }, [animes, isLoading, fetchError, setResults, setLoading])

  return (
    <section id="search-section">
      <div className="mt-16 [grid-area:aside]">
        <FilterSection />
      </div>

      <div className="mt-16 w-full [grid-area:results]">
        <SearchResults />
      </div>
    </section>
  )
}
