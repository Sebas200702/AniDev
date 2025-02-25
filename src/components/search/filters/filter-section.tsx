import {
  formatOptions,
  genreOptions,
  orderByOptions,
  ratingOptions,
  seasonOptions,
  statusOptions,
  yearOptions,
} from 'types'

import type { AppliedFilters } from 'types'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { studioOptions } from '@utils/create-studios-options'
import { useCallback } from 'react'
import { useSearchStoreResults } from '@store/search-results-store'

export const FilterSection = () => {
  const { appliedFilters, setAppliedFilters, resetFilters } =
    useSearchStoreResults()

  const updateFilter = useCallback(
    (category: keyof AppliedFilters, values: string[]) => {
      setAppliedFilters((prev) => {
        const newFilters = { ...prev }
        if (values.length > 0) {
          newFilters[category] = values
        } else {
          delete newFilters[category]
        }
        return newFilters
      })
    },
    [setAppliedFilters]
  )

  return (
    <section className="relative h-full w-full space-y-4 border-r border-gray-100/10 p-4 text-white">
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-1">
        <FilterDropdown
          label="Genres"
          values={appliedFilters.genre_filter ?? []}
          onChange={(values) => updateFilter('genre_filter', values)}
          onClear={() => updateFilter('genre_filter', [])}
          options={genreOptions}
        />
        <FilterDropdown
          label="Year"
          values={appliedFilters.year_filter ?? []}
          onChange={(values) => updateFilter('year_filter', values)}
          onClear={() => updateFilter('year_filter', [])}
          options={yearOptions}
        />
        <FilterDropdown
          label="Status"
          values={appliedFilters.status_filter ?? []}
          onChange={(values) => updateFilter('status_filter', values)}
          onClear={() => updateFilter('status_filter', [])}
          options={statusOptions}
        />
        <FilterDropdown
          label="Format"
          values={appliedFilters.type_filter ?? []}
          onChange={(values) => updateFilter('type_filter', values)}
          onClear={() => updateFilter('type_filter', [])}
          options={formatOptions}
        />
        <FilterDropdown
          label="Studio"
          values={appliedFilters.studio_filter ?? []}
          onChange={(values) => updateFilter('studio_filter', values)}
          onClear={() => updateFilter('studio_filter', [])}
          options={studioOptions}
        />
        <FilterDropdown
          label="Season"
          values={appliedFilters.season_filter ?? []}
          onChange={(values) => updateFilter('season_filter', values)}
          onClear={() => updateFilter('season_filter', [])}
          options={seasonOptions}
        />
        <FilterDropdown
          label="Rating"
          values={appliedFilters.rating_filter ?? []}
          onChange={(values) => updateFilter('rating_filter', values)}
          onClear={() => updateFilter('rating_filter', [])}
          options={ratingOptions}
        />
        <FilterDropdown
          label="Order By"
          values={appliedFilters.order_by ?? []}
          onChange={(values) => updateFilter('order_by', values)}
          onClear={() => updateFilter('order_by', [])}
          options={orderByOptions}
        />

        <div>
          <button
            type="button"
            onClick={resetFilters}
            className="border-Complementary bg-Complementary hover:bg-base mx-auto flex w-full max-w-60 items-center justify-center rounded border px-4 py-2 text-sm transition-all hover:border-white hover:opacity-90 md:max-w-32"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </ul>
    </section>
  )
}
