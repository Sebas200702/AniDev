import { useEffect, useCallback, useMemo } from 'react'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import type { Anime } from 'types'
import { baseUrl } from '@utils'
import { SearchResults } from '@components/search-results'
import { useSearchStoreResults } from '@store/search-results-store'

export const SearchComponent = () => {
  const { query, setQuery, setResults } = useSearchStoreResults()
  const debouncedQuery = useDebounce(query, 500)

  const url = useMemo(() => {
    return debouncedQuery
      ? `${baseUrl}/api/animes?search_query=${debouncedQuery}&limit_count=6`
      : ''
  }, [debouncedQuery])

  const {
    data: animes,
    loading: isLoading,
    error: fetchError,
  } = useFetch<Anime[]>({
    url,
    skip: !debouncedQuery,
  })

  useEffect(() => {
    if (animes) {
      setResults(animes, isLoading, fetchError)
    }
  }, [animes, isLoading, fetchError, setResults])

  useEffect(() => {
    const url = new URL(window.location.href)
    const $input = document.getElementById('default-search') as HTMLInputElement
    const query = url.searchParams.get('q')
    if (query) {
      $input.value = query
      setQuery(query)
    }
  }, [setQuery])

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      window.history.pushState({}, '', `/search?q=${e.target.value}`)
    },
    [setQuery]
  )

  return (
    <section className="flex flex-col gap-4">
      <search className="w-full">
        <form className="mx-auto w-full max-w-3xl">
          <input
            type="search"
            id="default-search"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Search Animes..."
            required
            value={query || ''}
            onInput={handleInput}
          />
        </form>
      </search>
      <SearchResults />
    </section>
  )
}
