import { Overlay } from '@components/layout/overlay'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { SearchBar } from '@components/search/filters/search-bar'
import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'
import { useWindowWidth } from '@store/window-width'
import { studioOptions } from '@utils/create-studios-options'
import { useCallback, useState } from 'react'
import {
  SearchType,
  airedDayOptions,
  formatOptions,
  genreOptions,
  orderByOptions,
  ratingOptions,
  seasonOptions,
  statusOptions,
  typeMusic,
  yearOptions,
} from 'types'
import type { AppliedFilters } from 'types'

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
  const {
    appliedFilters,
    setAppliedFilters,
    resetFilters,
    currentType,
    setCurrentType,
  } = useSearchStoreResults()
  const { width } = useWindowWidth()
  const isMobile = width && width < 768
  const { parentalControl } = useGlobalUserPreferences()
  const [isOpen, setIsOpen] = useState(false)
  const restritedAnimes = 'rx+-+hentai'

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
    <section className="mt-20 flex flex-col gap-10 px-4 md:mt-30 md:px-20">
      <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
        <SearchBar />

        <ul className="bg-Complementary flex w-full -skew-x-8 transform flex-row overflow-hidden rounded-sm md:w-1/3">
          <Overlay className="bg-enfasisColor/20 h-full" />
          {Object.values(SearchType).map((type) => (
            <li className="w-full" key={type}>
              <button
                className={`text-m w-full py-2 ${
                  currentType === type
                    ? 'bg-enfasisColor/80'
                    : 'hover:bg-enfasisColor/40 items-center'
                } cursor-pointer rounded-md transition-all duration-300 ease-in-out`}
                onClick={() => {
                  setCurrentType(type)
                  setAppliedFilters({})
                }}
              >
                <span className="text-m flex w-full skew-x-8 items-center justify-center text-white capitalize">
                  {type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ul
        className={`no-scrollbar col-span-5 grid w-full grid-cols-2 gap-6 border-zinc-300/10 md:grid-cols-5`}
      >
        {currentType === SearchType.MUSIC ? (
          <FilterDropdown
            label="Type"
            values={appliedFilters.type_music ?? []}
            onChange={(values) => updateFilter('type_music', values)}
            onClear={() => updateFilter('type_music', [])}
            options={typeMusic}
            styles={'flex'}
          />
        ) : (
          <>
            <FilterDropdown
              label="Genres"
              values={appliedFilters.genre_filter ?? []}
              onChange={(values) => updateFilter('genre_filter', values)}
              onClear={() => updateFilter('genre_filter', [])}
              options={genreOptions}
              styles={'flex'}
            />
            <FilterDropdown
              label="Year"
              values={appliedFilters.year_filter ?? []}
              onChange={(values) => updateFilter('year_filter', values)}
              onClear={() => updateFilter('year_filter', [])}
              options={yearOptions}
              styles={'flex'}
            />
            <FilterDropdown
              label="Status"
              values={appliedFilters.status_filter ?? []}
              onChange={(values) => updateFilter('status_filter', values)}
              onClear={() => updateFilter('status_filter', [])}
              options={statusOptions}
              styles={'flex'}
            />

            <FilterDropdown
              label="Format"
              values={appliedFilters.type_filter ?? []}
              onChange={(values) => updateFilter('type_filter', values)}
              onClear={() => updateFilter('type_filter', [])}
              options={formatOptions}
              styles={`flex`}
            />

            <FilterDropdown
              label="Studio"
              values={appliedFilters.studio_filter ?? []}
              onChange={(values) => updateFilter('studio_filter', values)}
              onClear={() => updateFilter('studio_filter', [])}
              options={studioOptions}
              styles={`${(isMobile && isOpen) || (!isMobile && isOpen) ? 'flex' : 'hidden'}`}
            />
            <FilterDropdown
              label="Season"
              values={appliedFilters.season_filter ?? []}
              onChange={(values) => updateFilter('season_filter', values)}
              onClear={() => updateFilter('season_filter', [])}
              options={seasonOptions}
              styles={`${(isMobile && isOpen) || (!isMobile && isOpen) ? 'flex' : 'hidden'}`}
            />
            <FilterDropdown
              label="Day"
              values={appliedFilters.aired_day_filter ?? []}
              onChange={(values) => updateFilter('aired_day_filter', values)}
              onClear={() => updateFilter('aired_day_filter', [])}
              options={airedDayOptions}
              styles={`${(isMobile && isOpen) || (!isMobile && isOpen) ? 'flex' : 'hidden'}`}
            />
            <FilterDropdown
              label="Rating"
              values={appliedFilters.rating_filter ?? []}
              onChange={(values) => updateFilter('rating_filter', values)}
              onClear={() => updateFilter('rating_filter', [])}
              options={
                parentalControl
                  ? ratingOptions.filter(
                      (option) => option.value !== restritedAnimes
                    )
                  : ratingOptions
              }
              styles={`${(isMobile && isOpen) || (!isMobile && isOpen) ? 'flex' : 'hidden'}`}
            />
            <FilterDropdown
              label="Order By"
              values={appliedFilters.order_by ?? []}
              onChange={(values) => updateFilter('order_by', values)}
              onClear={() => updateFilter('order_by', [])}
              options={orderByOptions}
              styles={`${(isMobile && isOpen) || (!isMobile && isOpen) ? 'flex' : 'hidden'}`}
            />
          </>
        )}

        <li className="flex flex-col gap-2 rounded-lg">
          <span className="text-s font-extralight text-white">Actions</span>
          <div className="flex h-full w-full flex-row items-center justify-center">
            <button
              type="button"
              onClick={resetFilters}
              className="text-s hover:bg-enfasisColor/5 group bg-Complementary hover:border-enfasisColor/40 relative mx-auto flex h-full w-full cursor-pointer items-center justify-center rounded-l-lg border border-gray-100/10 px-3 py-2 text-white transition-all duration-200 ease-in-out"
            >
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <Overlay className="bg-enfasisColor/5 group-hover:bg-enfasisColor/10 h-full w-full" />
            </button>

            <button
              type="button"
              className="hover:bg-enfasisColor/5 bg-Complementary hover:border-enfasisColor/40 relative mx-auto flex h-full w-full cursor-pointer items-center justify-center rounded-r-lg border border-gray-100/10 px-3 py-2 text-white transition-all duration-200 ease-in-out"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <svg
                className={`h-4 w-4 transition-all duration-200 md:h-5 md:w-5 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
              <Overlay className="bg-enfasisColor/5 group-hover:bg-enfasisColor/10 h-full w-full" />
            </button>
          </div>
        </li>
      </ul>
    </section>
  )
}
