import { navigate } from 'astro:transitions/client'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { createFiltersToApply } from '@utils/filters-to-apply'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AnimeCardInfo } from 'types'

interface Props {
  location: string
}
/**
 * SearchBar component renders a search input field for querying anime.
 *
 * @description This component provides a responsive search interface that adapts between mobile and desktop views.
 * On mobile devices, it displays as a collapsed icon that expands when clicked, while on desktop it remains
 * permanently expanded. The component handles user interactions, manages input state, and provides real-time
 * search functionality.
 *
 * The component maintains internal states for the search query, loading status, and expansion state.
 * It implements event listeners to handle clicks outside the search bar and window resizing for responsive
 * behavior. The search input is debounced to prevent excessive API calls while typing, and results are
 * stored in a centralized search store for access across the application.
 *
 * The UI features a clean, minimalist design with a search icon button and an expanding input field.
 * The search bar changes appearance based on device size and interaction state, with smooth transitions
 * for an enhanced user experience. When submitted, it navigates to a dedicated search results page
 * with the query parameters included in the URL.
 *
 * @param {Props} props - The component props
 * @param {string} props.location - The current location of the search bar used to determine behavior
 * @returns {JSX.Element} The rendered search bar component with appropriate styling and behavior
 *
 * @example
 * <SearchBar location="top" />
 */
export const SearchBar = ({ location }: Props): JSX.Element => {
  const { query, setQuery, setLoading, appliedFilters, setResults, setUrl } =
    useSearchStoreResults()
  const { width: windowWidth, setWidth } = useWindowWidth()
  const { parentalControl } = useGlobalUserPreferences()
  const debouncedQuery = useDebounce(query, 600)
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = windowWidth && windowWidth < 768
  const isDesktop = windowWidth && windowWidth >= 768
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
    const handleClickOutside = (e: MouseEvent) => {
      const $searchBar = document.getElementById('search-bar')
      if ($searchBar && !$searchBar.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    setWidth(window.innerWidth)
    window.addEventListener('resize', () => setWidth(window.innerWidth))

    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
    }
  }, [setQuery])

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

  const toggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true)
      document.getElementById('default-search')?.focus()
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isMobile && !isExpanded) {
      e.preventDefault()
      toggleExpand()
    }
  }
  useEffect(() => {
    setLoading(isLoading)
    if (!isLoading) {
      setResults(animes, false, fetchError)
    }
  }, [animes, isLoading, fetchError, setResults, setLoading])

  return (
    <form
      className={`flex transition-all duration-300 md:relative md:w-full ${isExpanded && isMobile ? 'bg-Primary-950/30 absolute inset-0 z-50 w-full translate-y-16 p-4' : 'mx-auto h-10 w-10'} items-center justify-center text-white`}
      onSubmit={handleSubmit}
      id="search-bar"
    >
      <div className="border-Primary-50/30 flex w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border-1 bg-black/40 px-2 transition-all duration-300 ease-in-out">
        <input
          type="search"
          id="default-search"
          className={`text-s w-full border-none bg-transparent py-2 text-white transition-all duration-300 ease-in-out focus:ring-0 focus:outline-none ${isExpanded || isDesktop ? 'px-3 opacity-100' : 'w-0 px-0 opacity-0'}`}
          placeholder="Search"
          value={query}
          autoComplete="off"
          onChange={handleInput}
        />
        <button
          type="submit"
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-white transition-all duration-300 ease-in-out ${
            isMobile ? 'absolute' : ''
          } ${isExpanded && isMobile ? 'right-6' : ''}`}
          onClick={handleButtonClick}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
  )
}
