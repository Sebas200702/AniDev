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
      className={`fixed  flex     z-50 items-center justify-center bg-black/60  w-full h-full backdrop-blur-sm p-4 ${
        searchBarIsOpen ? 'block' : 'hidden'
      }`}
    >
      <form
        id="search-bar"
        role="search"
        onSubmit={handleSubmit}
        className="relative flex-col flex w-full max-w-xl  shadow-lg overflow-hidden gap-6"
      >
        <div className="text-gray-400 select-none md:flex hidden gap-4 ">
          For quick access:{' '}
          <kbd className="kbd bg-Primary-950 px-3 rounded-xs">Ctrl</kbd> +{' '}
          <kbd className="kbd bg-Primary-950 px-3 rounded-xs">S</kbd>
        </div>

        <div className="flex items-center bg-Complementary  px-4 py-2  rounded-md">
          <input
            type="search"
            id="default-search"
            className="w-full h-full  text-sm placeholder-gray-300  text-white  focus:outline-none"
            placeholder="Search Anime..."
            value={query}
            autoComplete="off"
            onChange={handleInput}
          />
          <button
            type="submit"
            aria-label="Search"
            className=" transform  flex items-center justify-center h-8 w-8"
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
