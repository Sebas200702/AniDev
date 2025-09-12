import { useSearchStoreResults } from '@search/stores/search-results-store'
import { CloseIcon } from '@shared/components/icons/common/close-icon'
import { SearchIcon } from '@shared/components/icons/search/search-icon'
import { Overlay } from 'domains/shared/components/layout/overlay'
export const SearchBar = () => {
  const { query, setQuery } = useSearchStoreResults()

  return (
    <div className="group hover:border-enfasisColor/50 bg-Complementary relative flex h-full w-full items-center justify-center rounded-lg border border-gray-100/10 px-3 py-2 text-white transition-all duration-300 ease-in-out md:w-2/3">
      <Overlay className="bg-enfasisColor/5 group-hover:bg-enfasisColor/10 h-full w-full" />
      <SearchIcon className="mr-3 h-4.5 w-4.5 text-gray-400" />
      <input
        type="text"
        className="min-w-[50px] flex-grow cursor-pointer bg-transparent focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setQuery('')
          }}
          className="hover:bg-enfasisColor/10 cursor-pointer rounded-full p-1"
          aria-label="Clear selection"
        >
          <CloseIcon className="h-3 w-3 text-gray-400" />
        </button>
      )}
    </div>
  )
}
