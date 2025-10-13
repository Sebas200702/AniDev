import { useEffect, useRef, useState } from 'react'

import type { FilterOption } from '@search/types'
import { CheckIcon } from '@shared/components/icons/common/check-icon'
import { CloseIcon } from '@shared/components/icons/common/close-icon'
import { Overlay } from 'domains/shared/components/layout/overlay'

interface FilterDropdownProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  onClear: () => void
  options: FilterOption[]
  styles: string
  singleSelect?: boolean
  InputText?: boolean
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
  styles,
  singleSelect = false,
  InputText = true,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dinamicLabel = `${options.find((option) => option.value === values[0])?.label ?? ''}${
    values.length > 1 ? ` +${values.length - 1}` : ''
  }`
  const placeholder = values.length === 0 ? 'Any' : dinamicLabel

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
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    })
  }, [])

  const toggleOption = (value: string) => {
    let newValues: string[]

    if (singleSelect || label === 'Order By') {
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
    <article className={`relative flex flex-col gap-2 ${styles}`}>
      <span className="text-s font-extralight text-white">{label}</span>
      <div
        className={`group hover:border-enfasisColor/50 bg-Complementary relative w-full rounded-lg border border-gray-100/10 text-white transition-all duration-300 ease-in-out`}
        ref={dropdownRef}
        onClick={handleInputClick}
      >
        <Overlay className="bg-enfasisColor/5 group-hover:bg-enfasisColor/10 h-full w-full" />
        <button
          type="button"
          className="custom-scrollbar flex h-full w-full cursor-pointer items-start gap-1 overflow-y-auto px-3 py-2"
          onClick={handleInputClick}
        >
          {InputText ? (
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full w-full flex-grow cursor-pointer bg-transparent focus:outline-none"
              aria-autocomplete="list"
              aria-controls="dropdown-options"
            />
          ) : (
            <span className="w-full cursor-pointer text-left capitalize">
              {values}
            </span>
          )}
        </button>

        <nav
          className="absolute top-1/2 right-2 flex max-w-60 -translate-y-1/2 items-center space-x-1 md:right-6"
          aria-label="Controls of selector"
        >
          {(values.length > 0 || search) && InputText && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
                setSearch('')
              }}
              className="hover:bg-enfasisColor/10 cursor-pointer rounded-full p-1 opacity-0 group-hover:opacity-100"
              aria-label="Clear selection"
            >
              <CloseIcon className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <button
            type="button"
            className={`z-10 h-4 w-4 cursor-pointer text-gray-400 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            aria-label={`${isOpen ? 'Close' : 'Open'} options`}
          >
            <svg
              fill="none"
              strokeWidth="1.75"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </nav>

        <div
          id="dropdown-options"
          className={`absolute -bottom-[1px] z-50 w-full translate-y-full px-1 ${isOpen ? 'h-auto opacity-100' : 'pointer-events-none h-0 opacity-0'}`}
        >
          <ul className="custom-scrollbar bg-Complementary flex max-h-60 flex-col gap-2 overflow-auto rounded-b-md border-x border-b border-gray-100/10 shadow-lg transition-all duration-300 ease-in-out md:px-2 md:py-4">
            {filteredOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`text-s flex w-full cursor-pointer flex-row items-center gap-2 rounded-sm p-2 transition-colors duration-300 ease-in-out md:text-sm ${values.includes(option.value) ? 'bg-enfasisColor/20 hover:bg-enfasisColor/40' : 'hover:bg-Primary-900'}`}
                onClick={() => toggleOption(option.value)}
              >
                <CheckIcon
                  className={`h-4 w-4 transition-opacity ${values.includes(option.value) ? 'opacity-100' : 'opacity-0'}`}
                />
                <span className="text-Primary-200">{option.label}</span>
              </button>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
