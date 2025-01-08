import React, { useCallback, useEffect, useState } from 'react'
import { useSearchStoreResults } from '@store/search-results-store'
import { useWindowWidth } from '@store/window-width'

interface Props {
  location: string
}

export const SearchBar = ({ location }: Props) => {
  const { query, setQuery } = useSearchStoreResults()
  const [isExpanded, setIsExpanded] = useState(false)
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()

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
  }, [])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    document.getElementById('default-search')?.focus()
  }

  return (
    <form
      className={`relative flex md:w-full ${!isExpanded ? 'mx-auto w-min' : ''} items-center justify-end text-white`}
      onSubmit={handleSubmit}
    >
      <div
        className={`flex items-center overflow-hidden rounded-lg bg-secondary/30 transition-all duration-300 ease-in-out ${isExpanded || (windowWidth && windowWidth >= 768) ? 'w-full' : 'h-10 w-10'} `}
      >
        <input
          type="search"
          id="default-search"
          className={`w-full border-none bg-transparent py-2 text-sm text-white transition-all duration-300 ease-in-out autofill:!bg-transparent autofill:!shadow-transparent focus:outline-none focus:ring-0 ${
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
          type="button"
          className={`flex items-center justify-center rounded-lg bg-transparent text-white transition-all duration-300 ease-in-out h-10 w-10 ${windowWidth && windowWidth < 768 ? 'absolute' : ''} ${isExpanded && windowWidth && windowWidth < 768 ? 'right-0' : ''} `}
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
