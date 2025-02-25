import '@styles/search-section.css';

import { useEffect, useMemo } from 'react';

import { SearchResults } from '@components/search/results/search-results';
import { useDebounce } from '@hooks/useDebounce';
import { useFetch } from '@hooks/useFetch';
import { useUrlSync } from '@hooks/useUrlSync';
import { useSearchStoreResults } from '@store/search-results-store';
import { baseUrl } from '@utils/base-url';
import { createFiltersToApply } from '@utils/filters-to-apply';

import { FilterSection } from './filters/filter-section';

import type { Anime } from 'types'
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
    <section className="custom-scrollbar" id="search-section">
      <div className="mt-16 [grid-area:aside]">
        <FilterSection />
      </div>

      <div className="mt-16 w-full [grid-area:results]">
        <SearchResults />
      </div>
    </section>
  )
}
