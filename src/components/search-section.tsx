import { SearchResults } from '@components/search-results'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useSearchStoreResults } from '@store/search-results-store'
import { FilterSection } from './filter-section'
import { baseUrl } from '@utils/base-url'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useMemo } from 'react'
import type { Anime } from 'types'

export const SearchComponent = () => {
  const { query, setQuery, setResults, appliedFilters } =
    useSearchStoreResults()
  const debouncedQuery = useDebounce(query, 500)

  // Filtra los filtros aplicados para obtener los parámetros adecuados
  const filtersToApply = useMemo(() => {
    return Object.entries(appliedFilters)
      .filter(([_, values]) => values && values.length > 0)
      .map(([category, values]) => {
        return `${category}=${values.map((value) => normalizeString(value)).join('_')}`
      })
      .join('&')
  }, [appliedFilters])

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
  useEffect(() => {
    setResults(animes ?? [], isLoading, fetchError)
  }, [animes, isLoading, fetchError, setResults, appliedFilters, query])

  useEffect(() => {
    const url = new URL(window.location.href)
    const queryParam = url.searchParams.get('q')
    if (queryParam) {
      setQuery(queryParam)
    }
  }, [setQuery])

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
