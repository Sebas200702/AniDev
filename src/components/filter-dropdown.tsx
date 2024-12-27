import React, { useEffect, useRef, useState } from 'react'
import type { FilterOption } from 'types'

interface FilterDropdownProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  onClear: () => void
  placeholder: string
  options: FilterOption[]
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
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
          className="flex max-h-[60px] w-full flex-wrap items-start gap-1 overflow-y-auto rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400"
          onClick={handleInputClick}
        >
          {values.map((value) => (
            <span
              key={value}
              className="mb-1 flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
            >
              {options.find((opt) => opt.value === value)?.label ?? value}
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
