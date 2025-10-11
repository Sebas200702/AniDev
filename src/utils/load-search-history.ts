import type { SearchHistory } from '@search/types'
import type { UserInfo } from '@user/types'

export const loadSearchHistory = async (
  userInfo: UserInfo | null
): Promise<SearchHistory[]> => {
  if (!userInfo) {
    const stored = localStorage.getItem('searchHistory')
    return stored ? JSON.parse(stored) : []
  }
  const response = await fetch('/api/searchHistory', {
    method: 'GET',
    credentials: 'include',
  })
  if (response.ok) {
    const data = await response.json()
    return data
  }
  return []
}
