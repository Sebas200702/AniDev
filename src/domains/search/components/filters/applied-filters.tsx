import { useSearchStoreResults } from '@store/search-results-store'
import { TagIcon } from 'domains/shared/components/icons/tag-icon'
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
    <section className="h-12 p-4 md:px-20">
      <div
        className={`flex h-12 w-full items-center gap-6 p-4 ${appliedFiltersEntries.length > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'} rounded-md transition-opacity duration-300`}
        title="Applied filters"
        aria-label="Applied filters"
      >
        <TagIcon className="text-enfasisColor h-6 w-6" />
        <div className="flex flex-wrap gap-2">
          {appliedFiltersEntries.map(([category, values]) =>
            values?.map((value) => (
              <span
                key={`${category}-${value}`}
                className="bg-enfasisColor/20 hover:bg-enfasisColor/30 text-Primary-100 inline-flex cursor-default items-center rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-300 ease-in-out"
              >
                {value}
                <button
                  onClick={() =>
                    removeFilter(category as keyof AppliedFilters, value)
                  }
                  className="text-enfasisColor/40 hover:text-enfasisColor ml-1 inline-flex h-4 w-4 cursor-pointer items-center justify-center"
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
