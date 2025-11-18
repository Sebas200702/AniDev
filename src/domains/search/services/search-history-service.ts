import { api } from '@libs/api'
import { toast } from '@pheralb/toast'
import type { SearchHistory } from '@search/types'
import { ToastType } from '@shared/types'
import type { UserInfo } from '@user/types'

const STORAGE_KEY = 'searchHistory'
const MAX_HISTORY_ITEMS = 50

/**
 * Load search history from local storage
 */
const loadFromLocalStorage = (): SearchHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[SearchHistoryService.loadFromLocalStorage] Error:', error)
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

/**
 * Save search history to local storage
 */
const saveToLocalStorage = (history: SearchHistory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('[SearchHistoryService.saveToLocalStorage] Error:', error)
  }
}

/**
 * Load search history from API
 */
const loadFromAPI = async (): Promise<SearchHistory[]> => {
  const response = await api.get<{ data: SearchHistory[] }>(
    '/user/searchHistory',
    { credentials: 'include' }
  )

  if (response.error) {
    throw new Error(response.error.message || 'Error loading search history')
  }

  return response.data?.data || []
}

/**
 * Search History Service
 *
 * @description
 * Service layer for search history operations. Handles business logic
 * for loading, saving, and deleting search history with support for both
 * local storage and API.
 *
 * @features
 * - Load history (from API if logged in, otherwise from local storage)
 * - Save history entries
 * - Delete all history
 * - Automatic deduplication and limiting
 */
export const SearchHistoryService = {
  /**
   * Load search history (from API if logged in, otherwise from local storage)
   */
  async load(userInfo: UserInfo | null): Promise<SearchHistory[]> {
    try {
      if (!userInfo) {
        return loadFromLocalStorage()
      }

      const history = await loadFromAPI()
      toast[ToastType.Success]({
        text: 'Search history loaded successfully',
      })
      return history
    } catch (error) {
      console.error('[SearchHistoryService.load] Error:', error)
      toast[ToastType.Error]({
        text: 'Failed to load search history',
      })
      return []
    }
  },

  /**
   * Delete all search history
   */
  async delete(userInfo: UserInfo | null): Promise<boolean> {
    try {
      if (!userInfo) {
        localStorage.removeItem(STORAGE_KEY)
        toast[ToastType.Success]({
          text: 'Search history deleted successfully',
        })
        return true
      }

      const response = await api.delete('/user/searchHistory', {
        credentials: 'include',
      })

      if (response.error) {
        throw new Error(
          response.error.message || 'Error deleting search history'
        )
      }

      toast[ToastType.Success]({
        text: 'Search history deleted successfully',
      })
      return true
    } catch (error) {
      console.error('[SearchHistoryService.delete] Error:', error)
      toast[ToastType.Error]({
        text: 'Failed to delete search history',
      })
      return false
    }
  },

  /**
   * Save search history entry
   * (Only for local storage, API saves automatically on search)
   */
  saveEntry(entry: SearchHistory, userInfo: UserInfo | null): void {
    if (userInfo) return // API handles this

    const history = loadFromLocalStorage()
    const newHistory = [
      entry,
      ...history.filter(
        (item) =>
          item.query !== entry.query ||
          JSON.stringify(item.appliedFilters) !==
            JSON.stringify(entry.appliedFilters)
      ),
    ].slice(0, MAX_HISTORY_ITEMS)

    saveToLocalStorage(newHistory)
  },
}
