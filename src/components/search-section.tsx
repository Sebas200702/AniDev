import React, { useMemo, useEffect, useCallback } from 'react'
import { SearchResults } from '@components/search-results'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useSearchStoreResults } from '@store/search-results-store'
import { FilterSection } from './filter-section'
import { baseUrl } from '@utils/base-url'
import { createFiltersToApply } from '@utils/filters-to-apply'
import type { Anime } from 'types'
import { useUrlSync } from '@hooks/useUrlSync'

export const SearchComponent: React.FC = () => {
  const { query, setResults, appliedFilters } = useSearchStoreResults()
  const debouncedQuery = useDebounce(query, 500)
  const filtersToApply = useMemo(
    () => createFiltersToApply(appliedFilters),
    [appliedFilters]
  )
  const url = useMemo(() => {
    const baseQuery = `${baseUrl}/api/animes?limit_count=24`
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

  const updateResults = useCallback(
    (
      newAnimes: Anime[] | null,
      newLoading: boolean,
      newError: string | null
    ) => {
      console.log('SearchComponent: Updating results', {
        animes: newAnimes,
        isLoading: newLoading,
        fetchError: newError,
      })
      setResults(newAnimes ?? [], newLoading, newError)
    },
    [setResults]
  )

  useEffect(() => {
    updateResults(animes, isLoading, fetchError)
  }, [animes, isLoading, fetchError, updateResults])

  useEffect(() => {
    console.log('SearchComponent: Current state', { query, appliedFilters })
  }, [query, appliedFilters])

  return (
    <section className="mt-10 flex flex-col gap-4">
      <div className="w-full">
        <form className="mx-auto flex w-full max-w-[calc(100dvw-8px)] gap-4">
          <FilterSection />
        </form>
      </div>
      <SearchResults />
    </section>
  )
}
