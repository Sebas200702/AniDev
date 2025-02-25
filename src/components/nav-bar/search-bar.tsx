import React, { useCallback, useEffect, useState } from 'react'

import { useSearchStoreResults } from '@store/search-results-store'
import { useWindowWidth } from '@store/window-width'

interface Props {
  location: string
}

export const SearchBar = ({ location }: Props) => {
  const { query, setQuery, setLoading } = useSearchStoreResults()
  const { width: windowWidth, setWidth } = useWindowWidth()
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = windowWidth && windowWidth < 768
  const isDesktop = windowWidth && windowWidth >= 768

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
      if (location.includes('search')) return
      e.preventDefault()
      window.location.href = `/search?q=${query}`
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

  const toggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true)
      document.getElementById('default-search')?.focus()
    }
  }

  return (
    <form
      className={`inset-0 flex transition-all duration-300 md:relative md:w-full ${isExpanded && isMobile ? 'bg-Primary-950/30 absolute z-50 w-full translate-y-full ' : 'mx-auto h-10 w-10 md:w-full'} items-center justify-center text-white`}
      onSubmit={handleSubmit}
      id="search-bar"
    >
      <div className="border-Primary-50/30 flex w-full items-center justify-center overflow-hidden rounded-lg border-1 bg-black/40 px-2 transition-all duration-300 ease-in-out">
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
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-white transition-all duration-300 ease-in-out ${isMobile ? 'absolute' : ''} ${isExpanded && isMobile ? 'right-2' : ''}`}
          onClick={toggleExpand}
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
