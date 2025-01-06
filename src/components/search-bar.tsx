import { useSearchStoreResults } from '@store/search-results-store'
import { useCallback } from 'react'

export const SearchBar = () => {
  const { query, setQuery } = useSearchStoreResults()

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    [setQuery]
  )

  return (
    <div className="relative w-full max-w-md text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 0h24v24H0z" stroke="none" />
          <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M21 21l-6-6" />
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        className="block w-full rounded-lg border border-gray-600 bg-secondary p-3 pl-10 text-sm text-gray-200 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500"
        placeholder="Search"
        value={query}
        onChange={handleInput}
      />
    </div>
  )
}
