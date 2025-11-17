import { useAutoCloseModal } from '@shared/hooks/useAutoCloseModal'
import { useDebounce } from '@search/stores/useDebounce'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useModal } from '@shared/hooks/useModal'
import { useRef } from 'react'
import { useSearchFilters } from '@search/hooks/useSearchFilters'
import { useSearchHistory } from '@search/hooks/useSearchHistory'
import { useSearchInput } from '@search/hooks/useSearchInput'
import { useSearchResults } from '@search/hooks/useSearchResults'
import { useSearchShortcuts } from '@search/hooks/useSearchShortcuts'
import { useSearchStoreResults } from '@search/stores/search-results-store'
import { useSearchUrl } from '@search/hooks/useSearchUrl'

export const useSearchBarLogic = () => {
  const {
    query,
    setQuery,
    setLoading,
    appliedFilters,
    setResults,
    setUrl,
    setTotalResults,
    addSearchHistory,
    setSearchHistoryIsOpen,
    setCurrentType,
    searchHistory,
    currentType,
    clearSearchHistory,
    setSearchHistory,
    setAppliedFilters,
  } = useSearchStoreResults()

  const { parentalControl, userInfo, trackSearchHistory } =
    useGlobalUserPreferences()
  const { closeModal, openModal, isOpen: isModalOpen } = useModal()

  const pathName = window.location.pathname
  const isSearchPage = pathName === '/search'
  const debouncedQuery = useDebounce(query, 500)
  const inputRef = useRef<HTMLInputElement>(null)

  useAutoCloseModal(isModalOpen, closeModal, { debounceMs: 500 })

  // URL y filtros
  const { url, filtersToApply } = useSearchUrl(
    currentType,
    debouncedQuery,
    appliedFilters,
    parentalControl
  )

  // Shortcuts
  useSearchShortcuts(
    closeModal,
    openModal,
    setSearchHistoryIsOpen,
    clearSearchHistory,
    trackSearchHistory,
    userInfo,
    isSearchPage
  )

  // Input handlers
  const { handleInput, handleSubmit } = useSearchInput(
    query,
    setQuery,
    setLoading,
    isSearchPage,
    closeModal
  )

  // Resultados de búsqueda
  const { data, loading, error } = useSearchResults(
    url,
    debouncedQuery,
    filtersToApply,
    query,
    appliedFilters,
    currentType,
    setUrl,
    setResults,
    setTotalResults,
    setLoading,
    addSearchHistory
  )

  // Historial de búsqueda
  useSearchHistory(
    searchHistory,
    trackSearchHistory,
    query,
    appliedFilters,
    userInfo,
    setSearchHistory
  )

  // Filtros
  useSearchFilters(currentType, setAppliedFilters)

  return {
    query,
    handleInput,
    handleSubmit,
    currentType,
    appliedFilters,
    setCurrentType,
    data,
    loading,
    error,
    inputRef,
  }
}
