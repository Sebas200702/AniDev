import { useSearchStoreResults } from '@store/search-results-store'

export const SearchBar = () => {
  const { query, setQuery } = useSearchStoreResults()

  return (
    <div className="text-white hover:bg-enfasisColor/20 border rounded-md flex px-4 justify-center border-gray-100/10 hover:border-enfasisColor transition-all duration-200 ease-in-out">
      <input
        type="text"
        className="min-w-[50px] flex-grow bg-transparent focus:outline-none cursor-pointer"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
