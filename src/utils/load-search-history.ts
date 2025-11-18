import type { SearchHistory } from '@search/types'
import type { UserInfo } from '@user/types'
import { SearchHistoryService } from '@search/services/search-history-service'

/**
 * Load search history for the current user
 * @deprecated Use SearchHistoryService.load() directly instead
 */
export const loadSearchHistory = async (
  userInfo: UserInfo | null
): Promise<SearchHistory[]> => {
  return SearchHistoryService.load(userInfo)
}
