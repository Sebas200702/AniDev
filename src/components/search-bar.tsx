import React, { useCallback, useEffect, useState } from 'react';

import { useSearchStoreResults } from '@store/search-results-store';
import { useWindowWidth } from '@store/window-width';

interface Props {
  location: string
}

export const SearchBar = ({ location }: Props) => {
  const { query, setQuery, setLoading } = useSearchStoreResults()
  const [isExpanded, setIsExpanded] = useState(true)
  const [count, setCount] = useState(0)
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()
  const mobileSettings =
    isExpanded && windowWidth && windowWidth < 768 && count % 2 === 0
  const desktopSettings = isExpanded && windowWidth && windowWidth >= 768

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      setWindowWidth(newWidth)
      if (newWidth >= 768) {
        setIsExpanded(true)
      } else {
        setIsExpanded(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const $searchBar = document.getElementById('search-bar') as HTMLFormElement
    window.addEventListener('click', (e) => {
      if ($searchBar && !$searchBar.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    })
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (location.includes('search')) return
      e.preventDefault()
      window.location.href = `/search?q=${query}`
    },
    [query, location]
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setLoading(true)
  }, [])

  const toggleExpand = () => {
    setCount(count + 1)
    if (isExpanded) return
    setIsExpanded(!isExpanded)
    document.getElementById('default-search')?.focus()
  }

  return (
    <form
      className={`inset-0 flex transition-all duration-300 md:relative md:w-full ${isExpanded && windowWidth && windowWidth < 768 ? 'bg-Primary-950/30 absolute z-50 w-full translate-y-full p-2' : 'mx-auto h-10 w-10 md:w-full'} items-center justify-center text-white`}
      onSubmit={handleSubmit}
      id="search-bar"
    >
      <div
        className={`flex w-full items-center justify-center overflow-hidden border-1 border-Primary-50/30 rounded-lg bg-black/40 px-2 transition-all duration-300 ease-in-out`}
      >
        <input
          type="search"
          id="default-search"
          className={`text-s w-full border-none bg-transparent py-2 text-white transition-all duration-300 ease-in-out focus:ring-0 focus:outline-none ${
            isExpanded || (windowWidth && windowWidth >= 768)
              ? 'px-3 opacity-100'
              : 'w-0 px-0 opacity-0'
          }`}
          placeholder="Search"
          value={query}
          autoComplete="off"
          onChange={handleInput}
        />

        <button
          type={mobileSettings || desktopSettings ? 'submit' : 'button'}
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-white transition-all duration-300 ease-in-out ${windowWidth && windowWidth < 768 ? 'absolute' : ''} ${isExpanded && windowWidth && windowWidth < 768 ? 'right-2' : ''} `}
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
