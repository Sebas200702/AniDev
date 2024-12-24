import { SearchResults } from '@components/search-results'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useSearchStoreResults } from '@store/search-results-store'
import { FilterSection } from './filter-section'
import { baseUrl, normalizeString } from '@utils'
import { useCallback, useEffect, useMemo } from 'react'
import type { Anime } from 'types'

export const SearchComponent = () => {
  const { query, setQuery, setResults, appliedFilters } =
    useSearchStoreResults()
  const debouncedQuery = useDebounce(query, 500)

  const filtersToApply = useMemo(() => {
    return Object.entries(appliedFilters)
      .filter(([_, values]) => values && values.length > 0)
      .map(([category, values]) => {
        return `${category}=${values!.map((value) => normalizeString(value)).join('_')}`
      })
      .join('&')
  }, [appliedFilters])

  const url = useMemo(() => {
    const baseQuery = `${baseUrl}/api/animes?limit_count=6`
    const searchQuery = debouncedQuery ? `&search_query=${debouncedQuery}` : ''
    const filterQuery = filtersToApply ? `&${filtersToApply}` : ''
    return debouncedQuery
      ? `${baseQuery}${searchQuery}${filterQuery}`
      : `${baseQuery}&${filterQuery}`
  }, [debouncedQuery, filtersToApply])

  const {
    data: animes,
    loading: isLoading,
    error: fetchError,
  } = useFetch<Anime[]>({
    url,
    skip: !url,
  })

  useEffect(() => {
    if (animes) {
      setResults(animes, isLoading, fetchError)
    }
  }, [animes, isLoading, fetchError, setResults, appliedFilters])

  useEffect(() => {
    const url = new URL(window.location.href)
    const $input = document.getElementById('default-search') as HTMLInputElement
    const query = url.searchParams.get('q')
    if (query) {
      $input.value = query
      setQuery(query)
    }
  }, [setQuery])

  useEffect(() => {
    console.log('URL de búsqueda:', url)
  }, [url])

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
