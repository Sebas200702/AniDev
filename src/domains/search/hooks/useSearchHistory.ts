import { SearchHistoryService } from '@search/services/search-history-service'
import type { SearchHistory } from '@search/types'
import type { UserInfo } from '@user/types'
import { useCallback, useEffect, useState } from 'react'

interface UseSearchHistoryParams {
  trackSearchHistory: boolean
  userInfo: UserInfo | null
  setSearchHistory: (history: SearchHistory[]) => void
}

interface UseSearchHistoryReturn {
  loadHistory: () => Promise<void>
  deleteHistory: () => Promise<boolean>
  isLoading: boolean
}

/**
 * Hook for managing search history
 * Handles loading and deleting search history with proper error handling
 */
export const useSearchHistory = ({
  trackSearchHistory,
  userInfo,
  setSearchHistory,
}: UseSearchHistoryParams): UseSearchHistoryReturn => {
  const [isLoading, setIsLoading] = useState(false)

  const loadHistory = useCallback(async () => {
    if (!trackSearchHistory) {
      setSearchHistory([])
      return
    }

    setIsLoading(true)
    try {
      const history = await SearchHistoryService.load(userInfo)
      setSearchHistory(history)
    } catch (error) {
      console.error('Failed to load search history in hook:', error)
      setSearchHistory([])
    } finally {
      setIsLoading(false)
    }
  }, [trackSearchHistory, userInfo, setSearchHistory])

  const deleteHistory = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await SearchHistoryService.delete(userInfo)
      if (success) {
        setSearchHistory([])
      }
      return success
    } catch (error) {
      console.error('Failed to delete search history in hook:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userInfo, setSearchHistory])

  // Load search history on mount and when tracking preferences change
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return { loadHistory, deleteHistory, isLoading }
}
