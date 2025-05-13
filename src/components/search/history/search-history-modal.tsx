import { DeleteIcon } from '@components/icons/delete-icon'
import { HistoryIcon } from '@components/icons/history-icon'
import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'
import { deleteSearchHistory } from '@utils/delete-search-history'
import { saveSearchHistory } from '@utils/save-search-history'
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-Complementary rounded-lg p-6 w-full max-w-md mx-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lx">Search History</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:text-enfasisColor/70 transition-colors cursor-pointer p-2 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {searchHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <HistoryIcon className="w-12 h-12 text-Primary-100" />
              <p className="text-Primary-200 text-m">No search history yet</p>
            </div>
          ) : (
            searchHistory.map((history, index) => (
              <div
                key={index}
                onClick={() =>
                  handleClick(history.query, history.appliedFilters)
                }
                className="bg-Primary-950 relative group rounded-lg p-4 w-full hover:bg-enfasisColor/20 border-Primary-950 hover:border-enfasisColor/40 border-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-Primary-100 text-l font-medium">
                      {history.query}
                    </p>
                    <span className="text-Primary-100 opacity-100 pointer-events-none group-hover:opacity-0 transition-all group-hover:pointer-events-none duration-300 text-s">
                      {history.totalResults} results
                    </span>
                    <button
                      className="opacity-0 mx-2 absolute cursor-pointer hover:text-enfasisColor/70 right-2 pointer-events-none group-hover:opacity-100 transition-all group-hover:pointer-events-auto duration-300 text-Primary-100"
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
                      <DeleteIcon className="w-6 h-6 " />
                    </button>
                  </div>
                  {Object.keys(history.appliedFilters).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(history.appliedFilters)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-Primary-800 text-Primary-100 text-s px-2 py-1 rounded-md"
                          >
                            {key}: {formatFilterValue(value)}
                          </span>
                        ))}
                      {Object.keys(history.appliedFilters).length > 2 && (
                        <span className="bg-Primary-800 text-Primary-100 text-s px-2 py-1 rounded-md flex items-center gap-1">
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
              className="w-full button-primary"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
