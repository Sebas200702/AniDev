import { toast } from '@pheralb/toast'

import { ToastType, type UserInfo } from 'types'

export const deleteSearchHistory = async (userInfo: UserInfo | null) => {
  try {
    if (!userInfo) {
      localStorage.removeItem('searchHistory')
      return
    }
    const response = await fetch('/api/searchHistory', {
      method: 'DELETE',
      credentials: 'include',
    })
    if (response.ok) {
      toast[ToastType.Success]({
        text: 'Search history deleted successfully',
      })
    } else {
      toast[ToastType.Error]({
        text: 'Failed to delete search history',
      })
    }
  } catch (error) {
    console.error('Failed to delete search history')
  }
}
