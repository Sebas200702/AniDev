import { useEffect } from 'react'
import { useFetch, useDebounce } from '@hooks/index'
import type { Anime } from 'types'
import { baseUrl } from '@utils'
import { SearchResults } from '@components/search-results'
import { useSearchStoreResults } from '@store/search-results-store'

export const SearchComponent = () => {
  const { query, setQuery } = useSearchStoreResults()
  const debouncedQuery = useDebounce(query, 500)
  const url = debouncedQuery
    ? `${baseUrl}/api/animes?search_query=${debouncedQuery}&limit_count=6&type_filter=tv`
    : ''
  const {
    data: animes,
    loading,
    error,
  } = useFetch<Anime[]>({
    url,
  })
  useEffect(() => {
    useSearchStoreResults.setState({ results: animes, loading, error, query })
  }, [animes, loading, error, query])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  return (
    <section className="flex flex-col gap-4">
      <search className="w-full">
        <form className="w-full max-w-3xl mx-auto">
          <input
            type="search"
            id="default-search"
            className="w-full  p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  "
            placeholder="Search Animes..."
            required
            onInput={handleInput}
          />
        </form>
      </search>
      <SearchResults />
    </section>
  )
}
