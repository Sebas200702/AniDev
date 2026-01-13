import { useCallback, useEffect, useState } from 'react'

export const EPISODES_PER_PAGE = 12

interface UseEpisodesPaginationReturn {
  currentPage: number
  totalPages: number
  handlePageChange: (page: number) => void
}

/**
 * Custom hook for managing episodes pagination
 *
 * Features:
 * - Calculates initial page based on current episode
 * - Updates URL with page parameter
 * - Manages page state
 */
export const useEpisodesPagination = (
  totalEpisodes: number,
  currentEpisode?: number
): UseEpisodesPaginationReturn => {
  // Calculate initial page based on current episode
  const initialPage = currentEpisode
    ? Math.ceil(currentEpisode / EPISODES_PER_PAGE)
    : 1

  const [currentPage, setCurrentPage] = useState(initialPage)
  const totalPages = Math.ceil(totalEpisodes / EPISODES_PER_PAGE)

  // Initialize page when component mounts or current episode changes
  useEffect(() => {
    if (currentEpisode) {
      const pageForEpisode = Math.ceil(currentEpisode / EPISODES_PER_PAGE)
      setCurrentPage(pageForEpisode)
    }
  }, [currentEpisode])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)

    // Update URL with page parameter
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', page.toString())
    window.history.pushState(
      { path: window.location.pathname },
      '',
      `${window.location.pathname}?${searchParams.toString()}`
    )
  }, [])

  return {
    currentPage,
    totalPages,
    handlePageChange,
  }
}
