import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { SearchResultsContainer } from '@search/components/search-global/search-bar-results'
import { useSearchBarLogic } from '@search/hooks/useSearchBarLogic'
import { SearchType } from '@search/types'
import { typeSearchOptions } from '@search/utils/constants'
import { SearchIcon } from '@shared/components/icons/search/search-icon'

interface SearchBarProps {
  visible?: boolean
}

export const SearchBar = ({ visible = true }: SearchBarProps) => {
  const {
    query,
    handleInput,
    handleSubmit,
    currentType,
    appliedFilters,
    setCurrentType,
  } = useSearchBarLogic()

  if (!visible) return null

  return (
    <>
      <form
        id="search-bar"
        role="search"
        onSubmit={handleSubmit}
        className="relative mt-24 flex w-full max-w-xl flex-col gap-6"
      >
        <header className="flex items-center justify-between">
          <div className="hidden gap-4 text-gray-300 select-none md:flex">
            For quick access:{' '}
            <kbd className="kbd bg-Primary-950 rounded-xs px-3">Ctrl</kbd> +{' '}
            <kbd className="kbd bg-Primary-950 rounded-xs px-3">K</kbd>
          </div>

          {Object.keys(appliedFilters).length > 0 && (
            <strong className="text-gray-300">
              {Object.keys(appliedFilters).length}{' '}
              {Object.keys(appliedFilters).length === 1 ? 'filter' : 'filters'}{' '}
              applied
            </strong>
          )}

          <FilterDropdown
            options={typeSearchOptions}
            label="Type"
            values={[currentType]}
            onChange={(values) => setCurrentType(values[0] as SearchType)}
            onClear={() => {}}
            styles="max-w-40 w-full"
            singleSelect={true}
            InputText={false}
          />
        </header>

        <div className="bg-Primary-950 flex items-center rounded-md px-4 py-2">
          <input
            type="search"
            id="default-search"
            className="h-full min-h-9 w-full text-sm text-white placeholder-gray-400 focus:outline-none"
            placeholder={`Search ${currentType}...`}
            value={query}
            autoComplete="off"
            onChange={handleInput}
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-8 w-8 transform items-center justify-center"
          >
            <SearchIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </form>

      <SearchResultsContainer />
    </>
  )
}
