import { toast } from '@pheralb/toast'
import { AddToListIcon } from '@shared/components/icons/anime/add-to-list-icon'
import { DeleteIcon } from '@shared/components/icons/common/delete-icon'
import { useUserListsStore } from '@user/stores/user-list-store'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useEffect } from 'react'
import { ToastType } from 'types'

export const AddToListButton = ({
  animeId,
  styles,
  anime_title,
}: {
  animeId: number
  anime_title: string
  styles?: string
}) => {
  const { isLoading, setIsLoading, isInWatchList, setIsInWatchList } =
    useUserListsStore()
  const { watchList, setWatchList, userInfo } = useGlobalUserPreferences()

  useEffect(() => {
    if (watchList.length > 0) {
      setIsInWatchList(watchList.some((watch) => watch.mal_id === animeId))
    }
  }, [watchList])

  type Action = {
    type: 'ADD' | 'REMOVE'
    animeId: number
    previousWatchList: any[]
    wasInList: boolean
  }

  const executeAction = async (action: Action) => {
    if (!userInfo?.name) {
      return
    }

    setIsLoading(true)

    try {
      if (action.type === 'ADD') {
        setIsInWatchList(true)

        await fetch('/api/watchList', {
          method: 'POST',
          body: JSON.stringify({ animeId: action.animeId, type: 'To Watch' }),
          credentials: 'include',
        }).then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
        })
      } else {
        const newWatchList = action.previousWatchList.filter(
          (watch) => watch.mal_id !== action.animeId
        )
        setWatchList(newWatchList)
        setIsInWatchList(false)

        try {
          await fetch('/api/watchList', {
            method: 'DELETE',
            body: JSON.stringify({ animeId: action.animeId }),
            credentials: 'include',
          }).then((res) => {
            if (!res.ok) throw new Error('Error while removing from list')
          })
        } catch (_error) {
          setWatchList(action.previousWatchList)
          setIsInWatchList(action.wasInList)
          throw _error
        }
      }
    } catch (error) {
      console.error(error)
      if (action.type === 'ADD') {
        setIsInWatchList(action.wasInList)
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const createUndoAction = (originalAction: Action): Action => {
    if (originalAction.type === 'ADD') {
      return {
        type: 'REMOVE',
        animeId: originalAction.animeId,
        previousWatchList: watchList,
        wasInList: true,
      }
    } else {
      return {
        type: 'ADD',
        animeId: originalAction.animeId,
        previousWatchList: originalAction.previousWatchList,
        wasInList: false,
      }
    }
  }

  const handleActionWithSingleToast = async (action: Action) => {
    const loadingText =
      action.type === 'ADD' ? 'Adding to list' : 'Removing from list'
    const successText = action.type === 'ADD' ? 'added to' : 'removed from'
    const errorText = action.type === 'ADD' ? 'adding to' : 'removing from'

    const undoAction = createUndoAction(action)

    toast[ToastType.Loading]({
      text: loadingText,
      options: {
        promise: executeAction(action),
        success: `${anime_title} ${successText} list`,
        error: `Error while ${errorText} list`,
        autoDismiss: true,
      },
      action: {
        content: 'Undo',
        onClick: () => {
          handleActionWithSingleToast(undoAction)
        },
      },
    })
  }

  const handleClick = () => {
    if (isInWatchList) {
      const action: Action = {
        type: 'REMOVE',
        animeId,
        previousWatchList: [...watchList],
        wasInList: true,
      }
      handleActionWithSingleToast(action)
    } else {
      const action: Action = {
        type: 'ADD',
        animeId,
        previousWatchList: [...watchList],
        wasInList: false,
      }
      handleActionWithSingleToast(action)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !userInfo?.name}
      title={isInWatchList ? 'Remove from list' : 'Add to list'}
      className={`${styles} flex items-center justify-center`}
    >
      {isInWatchList ? (
        <DeleteIcon className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <AddToListIcon className="h-4 w-4 md:h-5 md:w-5" />
      )}
    </button>
  )
}
