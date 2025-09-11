import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'
import { deleteSearchHistory } from '@utils/delete-search-history'
import { saveSearchHistory } from '@utils/save-search-history'
import { DeleteIcon } from 'domains/shared/components/icons/delete-icon'
import { HistoryIcon } from 'domains/shared/components/icons/history-icon'
import { useEffect, useRef } from 'react'
import type { AppliedFilters } from 'types'

interface SearchHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchHistoryModal = ({
  isOpen,
  onClose,
}: SearchHistoryModalProps) => {
  const {
    searchHistory,
    setQuery,
    setAppliedFilters,
    clearSearchHistory,
    setSearchHistory,
  } = useSearchStoreResults()
  const modalRef = useRef<HTMLDivElement>(null)
  const { userInfo, trackSearchHistory } = useGlobalUserPreferences()
  const handleClick = (query: string, appliedFilters: AppliedFilters) => {
    setQuery(query)
    setAppliedFilters(appliedFilters)
    onClose()
  }

  const formatFilterValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      if (value.length > 2) {
        return `${value[0]}, ${value[1]} +${value.length - 2}`
      }
      return value.join(', ')
    }
    return value
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-Complementary custom-scrollbar mx-4 max-h-[60vh] w-full max-w-md overflow-y-auto rounded-lg p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lx">Search History</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:text-enfasisColor/70 cursor-pointer rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {searchHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <HistoryIcon className="text-Primary-100 h-12 w-12" />
              <p className="text-Primary-200 text-m">No search history yet</p>
            </div>
          ) : (
            searchHistory.map((history, index) => (
              <div
                key={index}
                onClick={() =>
                  handleClick(history.query, history.appliedFilters)
                }
                className="bg-Primary-950 group hover:bg-enfasisColor/20 border-Primary-950 hover:border-enfasisColor/40 relative w-full cursor-pointer rounded-lg border-1 p-4 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-Primary-100 text-l font-medium">
                      {history.query || 'No query'}
                    </p>
                    <span className="text-Primary-100 text-s pointer-events-none opacity-100 transition-all duration-300 group-hover:pointer-events-none group-hover:opacity-0">
                      {history.totalResults} results
                    </span>
                    <button
                      className="hover:text-enfasisColor/70 text-Primary-100 pointer-events-none absolute right-2 mx-2 cursor-pointer opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        const updatedHistory = searchHistory.filter(
                          (_, i) => i !== index
                        )
                        setSearchHistory(updatedHistory)
                        if (!trackSearchHistory) return
                        saveSearchHistory(updatedHistory, userInfo)
                      }}
                    >
                      <DeleteIcon className="h-6 w-6" />
                    </button>
                  </div>
                  {Object.keys(history.appliedFilters).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(history.appliedFilters)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-Primary-800 text-Primary-100 text-s rounded-md px-2 py-1"
                          >
                            {key}: {formatFilterValue(value)}
                          </span>
                        ))}
                      {Object.keys(history.appliedFilters).length > 2 && (
                        <span className="bg-Primary-800 text-Primary-100 text-s flex items-center gap-1 rounded-md px-2 py-1">
                          +{Object.keys(history.appliedFilters).length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {searchHistory.length > 0 && (
            <button
              onClick={() => {
                clearSearchHistory()
                if (!trackSearchHistory) return
                deleteSearchHistory(userInfo)
              }}
              className="button-primary w-full"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
