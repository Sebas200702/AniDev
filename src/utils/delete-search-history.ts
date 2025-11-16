import { ToastType } from '@shared/types'
import type { UserInfo } from '@user/types'
import { api } from '@libs/api'
import { toast } from '@pheralb/toast'

export const deleteSearchHistory = async (userInfo: UserInfo | null) => {
  try {
    if (!userInfo) {
      localStorage.removeItem('searchHistory')
      return
    }

    const response = await api.delete('/searchHistory', {
      credentials: 'include',
    })

    if (response.error) {
      throw new Error(response.error.message || 'Error deleting search history')
    }

    return toast[ToastType.Success]({
      text: 'Search history delete successfully',
    })
  } catch (error) {
    console.error('Failed to delete search history', error)
    return toast[ToastType.Error]({
      text: 'Failed to delete search history',
    })
  }
}
