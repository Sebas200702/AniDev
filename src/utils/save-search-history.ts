import type { SearchHistory, UserInfo } from '@user/types'

export const saveSearchHistory = async (
  history: SearchHistory[],
  userInfo: UserInfo | null
) => {
  if (!userInfo) {
    localStorage.setItem('searchHistory', JSON.stringify(history))
    return
  }
  const _response = await fetch('/api/searchHistory', {
    method: 'POST',
    body: JSON.stringify(history),
    credentials: 'include',
  })
}
