import { SearchHistoryService } from '@search/services/search-history-service'
import type { SearchHistory } from '@search/types'
import type { UserInfo } from '@user/types'

/**
 * Load search history for the current user
 * @deprecated Use SearchHistoryService.load() directly instead
 */
export const loadSearchHistory = async (
  userInfo: UserInfo | null
): Promise<SearchHistory[]> => {
  return SearchHistoryService.load(userInfo)
}
