import { AddToListIcon } from '@components/icons/add-to-list-icon'
import { DeleteIcon } from '@icons/delete-icon'
import { toast } from '@pheralb/toast'
import { useUserListsStore } from '@store/user-list-store'
import { useEffect, useState } from 'react'
import { ToastType } from 'types'

export const AddToListButton = ({
  animeId,
  styles,
}: {
  animeId: number
  styles?: string
}) => {
  const { watchList, setWatchList, isLoading, setIsLoading } =
    useUserListsStore()

  const isInWatchList = watchList.some((watch) => watch.mal_id === animeId)
  const handleAddToList = async () => {
    const promise = fetch('/api/watchList', {
      method: 'POST',
      body: JSON.stringify({ animeId, type: 'To Watch' }),
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
  useEffect(() => {
    const fetchWatchList = async () => {
      const response = await fetch('/api/watchList')
      const data = await response.json()
      setWatchList(data)
      setIsLoading(false)
    }
    fetchWatchList()
  }, [isLoading])

  const handleRemoveFromList = async () => {
    const newWatchList = watchList.filter((watch) => watch.mal_id !== animeId)
    setWatchList(newWatchList)
    const promise = fetch('/api/watchList', {
      method: 'DELETE',
      body: JSON.stringify({ animeId }),
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
      disabled={isLoading}
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
