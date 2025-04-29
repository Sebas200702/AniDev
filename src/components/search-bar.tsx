import { navigate } from 'astro:transitions/client'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'

import { baseUrl } from '@utils/base-url'
import { createFiltersToApply } from '@utils/filters-to-apply'
import { useCallback, useEffect, useMemo } from 'react'
import type { AnimeCardInfo } from 'types'

interface Props {
  location: string
}

export const SearchBar = ({ location }: Props): JSX.Element => {
  const {
    query,
    setQuery,
    setLoading,
    appliedFilters,
    setResults,
    setUrl,
    searchBarIsOpen,
    setSearchIsOpen,
  } = useSearchStoreResults()
  const { parentalControl } = useGlobalUserPreferences()
  const debouncedQuery = useDebounce(query, 600)

  const filtersToApply = useMemo(
    () => createFiltersToApply(appliedFilters),
    [appliedFilters]
  )

  const url = useMemo(() => {
    const baseQuery = `${baseUrl}/api/animes?limit_count=30&banners_filter=false&format=search&parental_control=${parentalControl}`
    const searchQuery = debouncedQuery ? `&search_query=${debouncedQuery}` : ''
    const filterQuery = filtersToApply ? `&${filtersToApply}` : ''
    return `${baseQuery}${searchQuery}${filterQuery}`
  }, [debouncedQuery, filtersToApply, parentalControl])

  const {
    data: animes,
    loading: isLoading,
    error: fetchError,
  } = useFetch<AnimeCardInfo[]>({
    url,
    skip: !url || (!filtersToApply && !debouncedQuery),
  })

  useEffect(() => {
    setUrl(url)
  }, [url])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const $SearchBarContainer = document.getElementById(
        'search-bar-container'
      )
      console.log(event.target === $SearchBarContainer)

      if (event.target && event.target === $SearchBarContainer) {
        setSearchIsOpen(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (location.includes('search')) return

      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    },
    [query, location]
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      setLoading(true)
    },
    [setQuery, setLoading]
  )

  useEffect(() => {
    if (!query) {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    setLoading(isLoading)
    if (!isLoading) {
      setResults(animes, false, fetchError)
    }
  }, [animes, isLoading, fetchError, setResults, setLoading])

  return (
    <div
      id="search-bar-container"
      className={`fixed z-50 flex h-full w-full items-center justify-center bg-black/60 p-4 backdrop-blur-sm ${
        searchBarIsOpen ? 'block' : 'hidden'
      }`}
    >
      <form
        id="search-bar"
        role="search"
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-xl flex-col gap-6 overflow-hidden shadow-lg"
      >
        <div className="hidden gap-4 text-gray-400 select-none md:flex">
          For quick access:{' '}
          <kbd className="kbd bg-Primary-950 rounded-xs px-3">Ctrl</kbd> +{' '}
          <kbd className="kbd bg-Primary-950 rounded-xs px-3">S</kbd>
        </div>

        <div className="bg-Complementary flex items-center rounded-md px-4 py-2">
          <input
            type="search"
            id="default-search"
            className="h-full w-full text-sm text-white placeholder-gray-300 focus:outline-none"
            placeholder="Search Anime..."
            value={query}
            autoComplete="off"
            onChange={handleInput}
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-8 w-8 transform items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
