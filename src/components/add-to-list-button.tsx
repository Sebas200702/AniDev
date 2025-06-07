import { AddToListIcon } from '@components/icons/add-to-list-icon'
import { DeleteIcon } from '@icons/delete-icon'
import { toast } from '@pheralb/toast'
import { useGlobalUserPreferences } from '@store/global-user'
import { useUserListsStore } from '@store/user-list-store'
import { useEffect } from 'react'
import { ToastType } from 'types'

export const AddToListButton = ({
  animeId,
  styles,
}: {
  animeId: number
  styles?: string
}) => {
  const { isLoading, setIsLoading } = useUserListsStore()
  const { watchList, setWatchList, userInfo } = useGlobalUserPreferences()

  const isInWatchList = watchList.some((watch) => watch.mal_id === animeId)
  const handleAddToList = async () => {
    if (!userInfo?.name) {
      return
    }
    const promise = fetch('/api/watchList', {
      method: 'POST',
      body: JSON.stringify({ animeId, type: 'To Watch' }),
      credentials: 'include',
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
    })

    toast[ToastType.Loading]({
      text: 'Adding to list',
      options: {
        promise,
        success: 'Anime added to list',
        error: 'Error while adding to list',
        autoDismiss: true,
      },
    })

    setIsLoading(true)
    try {
      await promise
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromList = async () => {
    if (!userInfo?.name) {
      return
    }
    const newWatchList = watchList.filter((watch) => watch.mal_id !== animeId)
    setWatchList(newWatchList)
    const promise = fetch('/api/watchList', {
      method: 'DELETE',
      body: JSON.stringify({ animeId }),
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('Error while removing from list')
    })

    toast[ToastType.Loading]({
      text: 'Removing from list',
      options: {
        promise,
        success: 'Anime removed from list',
        error: 'Error while removing from list',
        autoDismiss: true,
      },
    })

    setIsLoading(true)
    try {
      await promise
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={isInWatchList ? handleRemoveFromList : handleAddToList}
      disabled={isLoading || !userInfo?.name}
      title={isInWatchList ? 'Remove from list' : 'Add to list'}
    >
      {isInWatchList ? (
        <DeleteIcon className={styles} />
      ) : (
        <AddToListIcon className={styles} />
      )}
    </button>
  )
}
