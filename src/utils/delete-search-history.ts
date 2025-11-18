import type { UserInfo } from '@user/types'
import { SearchHistoryService } from '@search/services/search-history-service'

/**
 * Delete all search history for the current user
 * @deprecated Use SearchHistoryService.delete() directly instead
 */
export const deleteSearchHistory = async (
  userInfo: UserInfo | null
): Promise<boolean> => {
  return SearchHistoryService.delete(userInfo)
}
