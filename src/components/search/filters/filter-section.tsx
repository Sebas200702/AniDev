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

/**
 * FilterSection component provides a comprehensive set of filters for anime search functionality.
 *
 * @description This component manages the display and application of various anime filters including
 * genres, years, status, format, studio, season, rating, and sorting options. It interacts with the
 * search store to update and maintain the state of applied filters across the application.
 *
 * The component implements a callback mechanism to efficiently update specific filter categories
 * without affecting other filter selections. When filter values are added, they're stored in the
 * appropriate category; when all values for a category are removed, that filter is deleted entirely.
 *
 * The UI presents filter options in a responsive grid layout that adapts to different screen sizes.
 * Each filter category is implemented as a dropdown with multi-select capability. A reset button
 * allows users to clear all applied filters at once for easy search refinement.
 *
 * @returns {JSX.Element} The rendered filter section with multiple filter dropdowns and a reset button
 *
 * @example
 * <FilterSection />
 */
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
    <ul className="no-scrollbar md:sticky top-16 mt-16 grid md:h-full w-full md:w-auto md:max-h-[calc(100vh-192px)] md:border-r border-zinc-300/10 grid-cols-2 gap-10 md:overflow-y-auto md:grid-cols-1 p-4">
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
      <button
        type="button"
        onClick={resetFilters}
        className="button-primary text-s flex w-full items-center justify-center gap-2"
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
    </ul>
  )
}
