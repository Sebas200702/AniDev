import { TagIcon } from '@components/icons/tag-icon'
import { useSearchStoreResults } from '@store/search-results-store'
import { useCallback, useMemo } from 'react'
import type { AppliedFilters } from 'types'
export const AppliedFiltersComponent = () => {
  const { appliedFilters, setAppliedFilters } = useSearchStoreResults()
  const appliedFiltersEntries = useMemo(
    () => Object.entries(appliedFilters),
    [appliedFilters]
  )
  const removeFilter = useCallback(
    (category: keyof AppliedFilters, value: string) => {
      console.log('FilterSection: Removing filter', { category, value })
      setAppliedFilters((prev) => {
        const newFilters = { ...prev }
        newFilters[category] =
          newFilters[category]?.filter((v) => v !== value) ?? []
        if (newFilters[category].length === 0) {
          delete newFilters[category]
        }
        return newFilters
      })
    },
    [setAppliedFilters]
  )
  return (
    <section className="md:px-20 p-4 h-12">
      <div
        className={`p-4 w-full h-12 flex gap-6 items-center   ${appliedFiltersEntries.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300  rounded-md `}
        title="Applied filters"
        aria-label="Applied filters"
      >
        <TagIcon className="h-6 w-6 text-enfasisColor" />
        <div className="flex flex-wrap gap-2">
          {appliedFiltersEntries.map(([category, values]) =>
            values?.map((value) => (
              <span
                key={`${category}-${value}`}
                className="inline-flex capitalize items-center rounded-full bg-enfasisColor/30 hover:bg-enfasisColor/40  px-3 py-1.5 text-xs font-medium text-Primary-100"
              >
                {value}
                <button
                  onClick={() =>
                    removeFilter(category as keyof AppliedFilters, value)
                  }
                  className="ml-1 inline-flex h-4 w-4  items-center justify-center text-enfasisColor hover:text-blue-500 cursor-pointer"
                  title={`Remove ${value} filter`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
