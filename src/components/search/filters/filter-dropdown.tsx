import { useEffect, useRef, useState } from 'react'

import type { FilterOption } from 'types'

interface FilterDropdownProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  onClear: () => void
  options: FilterOption[]
}

/**
 * FilterDropdown component provides a searchable dropdown filter for selecting multiple options.
 *
 * @description This component creates an accessible dropdown with search functionality for filtering options.
 * It manages the open/closed state of the dropdown, tracks selected values, and provides search filtering.
 * The component handles both single-select (for "Order By") and multi-select behaviors for other filter types.
 *
 * The dropdown includes clear functionality and keyboard navigation support. It's designed to be responsive,
 * automatically closing when clicking outside on mobile devices. The component maintains an internal state
 * for the dropdown visibility, search input, and filtered options based on the search query.
 *
 * The UI displays a label, search input, selected options, and control buttons. The dropdown options
 * are presented as a scrollable list with checkboxes that visually indicate the selected state.
 *
 * State Management:
 * - Tracks dropdown open/closed state
 * - Manages search input value
 * - Filters options based on search query
 * - Handles selected values
 * - Controls mobile responsiveness
 *
 * Event Handling:
 * - Click outside to close
 * - Keyboard navigation
 * - Search input changes
 * - Option selection/deselection
 * - Clear all selections
 *
 * @param {FilterDropdownProps} props - The component props
 * @param {string} props.label - The label text for the dropdown
 * @param {string[]} props.values - Array of currently selected option values
 * @param {function} props.onChange - Callback function when selection changes
 * @param {function} props.onClear - Callback function to clear all selections
 * @param {FilterOption[]} props.options - Available options to display in the dropdown
 * @returns {JSX.Element} The rendered dropdown filter component
 *
 * @example
 * <FilterDropdown
 *   label="Genres"
 *   values={selectedGenres}
 *   onChange={handleGenreChange}
 *   onClear={clearGenres}
 *   options={genreOptions}
 * />
 */
export const FilterDropdown = ({
  label,
  values,
  onChange,
  onClear,
  options,
}: FilterDropdownProps) => {
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
    window.addEventListener('click', (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        window.innerWidth < 768
      ) {
        setIsOpen(false)
      }
    })
  }, [])

  const toggleOption = (value: string) => {
    let newValues: string[]

    if (label === 'Order By') {
      newValues = values.includes(value) ? [] : [value]
    } else {
      newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    }

    onChange(newValues)
  }

  const handleInputClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON') {
      setIsOpen(true)
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className="relative mx-auto w-full border-b border-gray-100/10"
      ref={dropdownRef}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <div className="relative text-white">
        <button
          className="custom-scrollbar flex max-h-[60px] w-full cursor-text flex-wrap items-start gap-1 overflow-y-auto px-3 py-2"
          onClick={handleInputClick}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={label}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[50px] flex-grow bg-transparent focus:outline-none"
            aria-autocomplete="list"
            aria-controls="dropdown-options"
          />
        </button>

        <nav
          className="absolute top-1/2 right-6 flex max-w-60 -translate-y-1/2 items-center space-x-1"
          aria-label="Controls of selector"
        >
          {(values.length > 0 || search) && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClear()
                setSearch('')
              }}
              className="hover:bg-enfasisColor/80 rounded p-1"
              aria-label="Clear selection"
            >
              <svg
                className="h-3 w-3 text-gray-300"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ease-in-out hover:cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={`${isOpen ? 'Cerrar' : 'Abrir'} opciones`}
          >
            <svg
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </nav>
      </div>

      <ul
        id="dropdown-options"
        className={`custom-scrollbar bg-Primary-950 absolute bottom-0 z-30 mt-1 max-h-60 w-full translate-y-full overflow-auto rounded-md shadow-lg transition-all duration-300 ease-in-out md:static md:max-h-96 md:translate-y-0 ${isOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
      >
        {filteredOptions.map((option) => (
          <button
            key={option.value}
            className="hover:bg-Complementary flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm"
            onClick={() => toggleOption(option.value)}
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              readOnly
              className="peer hidden"
              id={`option-${option.value}`}
            />

            <span className="peer-checked:border-enfasisColor peer-checked:bg-enfasisColor flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border-2 border-gray-500 transition-all duration-200 ease-in-out">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-white transition-all duration-200 ease-in-out"
                style={{ opacity: values.includes(option.value) ? 1 : 0 }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>

            <span className="text-gray-400 peer-checked:text-white">
              {option.label}
            </span>
          </button>
        ))}
      </ul>
    </div>
  )
}
