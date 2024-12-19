import React, { useState, useEffect, useRef } from 'react'
import { useDirectoryStore } from '@store/directory-store'
interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  onClear: () => void
  placeholder: string
  options: FilterOption[]
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  values,
  onChange,
  onClear,
  placeholder,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleOption = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value]
    onChange(newValues)
  }

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((v) => v !== valueToRemove))
  }

  const handleInputClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON') {
      setIsOpen(true)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div
          className="flex max-h-[80px] w-full flex-wrap items-start gap-1 overflow-y-auto rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400"
          onClick={handleInputClick}
        >
          {values.map((value) => (
            <span
              key={value}
              className="mb-1 flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
            >
              {options.find((opt) => opt.value === value)?.label || value}
              <button
                onClick={() => removeValue(value)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            placeholder={values.length === 0 ? placeholder : ''}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[50px] flex-grow bg-transparent focus:outline-none"
          />
        </div>
        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center space-x-1">
          {(values.length > 0 || search) && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClear()
                setSearch('')
              }}
              className="rounded p-1 hover:bg-gray-200"
            >
              <svg
                className="h-3 w-3 text-gray-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform hover:cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeWidth="2"
            onClick={() => setIsOpen(!isOpen)}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => toggleOption(option.value)}
            >
              <input
                type="checkbox"
                checked={values.includes(option.value)}
                onChange={() => {}}
                className="mr-2"
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const genreOptions: FilterOption[] = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'thriller', label: 'Thriller' },
]

const tagOptions: FilterOption[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'new', label: 'New' },
  { value: 'award-winning', label: 'Award Winning' },
  { value: 'critically-acclaimed', label: 'Critically Acclaimed' },
  { value: 'hidden-gem', label: 'Hidden Gem' },
]

const yearOptions: FilterOption[] = Array.from({ length: 24 }, (_, i) => {
  const year = 2024 - i
  return { value: year.toString(), label: year.toString() }
})

const statusOptions: FilterOption[] = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'cancelled', label: 'Cancelled' },
]

const formatOptions: FilterOption[] = [
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
]

export const FilterSection = () => {
  const {
    genres,
    tags,
    years,
    statuses,
    formats,
    isExpanded,
    appliedFilters,
    setGenres,
    setTags,
    setYears,
    setStatuses,
    setFormats,
    setIsExpanded,
    setAppliedFilters,
  } = useDirectoryStore()

  const handleReset = () => {
    setGenres([])
    setTags([])
    setYears([])
    setStatuses([])
    setFormats([])
    setAppliedFilters({})
  }

  const handleApply = () => {
    const newAppliedFilters: Record<string, string[]> = {}
    if (genres.length) newAppliedFilters.Genres = genres
    if (tags.length) newAppliedFilters.Tags = tags
    if (years.length) newAppliedFilters.Years = years
    if (statuses.length) newAppliedFilters.Statuses = statuses
    if (formats.length) newAppliedFilters.Formats = formats
    setAppliedFilters(newAppliedFilters)
  }

  const removeFilter = (category: string, value: string) => {
    const updateState = (prevState: string[]) =>
      prevState.filter((item) => item !== value)
    switch (category) {
      case 'Genres':
        setGenres(updateState)
        break
      case 'Tags':
        setTags(updateState)
        break
      case 'Years':
        setYears(updateState)
        break
      case 'Statuses':
        setStatuses(updateState)
        break
      case 'Formats':
        setFormats(updateState)
        break
    }
    const newAppliedFilters = { ...appliedFilters }
    newAppliedFilters[category] = newAppliedFilters[category].filter(
      (item) => item !== value
    )
    if (newAppliedFilters[category].length === 0) {
      delete newAppliedFilters[category]
    }
    setAppliedFilters(newAppliedFilters)
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <FilterDropdown
          label="Genres"
          values={genres}
          onChange={setGenres}
          onClear={() => setGenres([])}
          placeholder="Select Genres"
          options={genreOptions}
        />
        <FilterDropdown
          label="Tags"
          values={tags}
          onChange={setTags}
          onClear={() => setTags([])}
          placeholder="Select Tags"
          options={tagOptions}
        />
        <FilterDropdown
          label="Year"
          values={years}
          onChange={setYears}
          onClear={() => setYears([])}
          placeholder="Any year"
          options={yearOptions}
        />
        <FilterDropdown
          label="Status"
          values={statuses}
          onChange={setStatuses}
          onClear={() => setStatuses([])}
          placeholder="Any Status"
          options={statusOptions}
        />
      </div>

      {isExpanded && (
        <div className="pt-2">
          <FilterDropdown
            label="Format"
            values={formats}
            onChange={setFormats}
            onClear={() => setFormats([])}
            placeholder="Any Format"
            options={formatOptions}
          />
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={handleApply}
          className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414v6.586a1 1 0 01-1.414.914l-2-1A1 1 0 0110 19.414V13.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Apply
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {Object.keys(appliedFilters).length > 0 && (
        <div className="mt-4 rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Applied Filters:
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([category, values]) =>
              values.map((value) => (
                <span
                  key={`${category}-${value}`}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                >
                  {value}
                  <button
                    onClick={() => removeFilter(category, value)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center text-blue-400 hover:text-blue-500"
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
      )}
    </div>
  )
}
