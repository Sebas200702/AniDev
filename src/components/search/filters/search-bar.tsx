import { useSearchStoreResults } from '@store/search-results-store'

export const SearchBar = () => {
  const { query, setQuery } = useSearchStoreResults()

  return (
    <div className="hover:bg-enfasisColor/20 hover:border-enfasisColor flex justify-center rounded-md border border-gray-100/10 px-4 text-white transition-all duration-200 ease-in-out">
      <input
        type="text"
        className="min-w-[50px] flex-grow cursor-pointer bg-transparent focus:outline-none"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
