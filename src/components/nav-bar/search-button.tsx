import { useSearchStoreResults } from '@store/search-results-store'
export const SearchButton = () => {
  const { setSearchIsOpen } = useSearchStoreResults()
  const handleClick = () => {
    setSearchIsOpen(true)
  }

  return (
    <button
      className="hover:text-enfasisColor transition-all duration-300 px-2 py-4  cursor-pointer"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
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
  )
}
