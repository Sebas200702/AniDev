import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { toast } from '@pheralb/toast'
import { DeleteIcon } from '@shared/components/icons/common/delete-icon'
import { AddToPlayList } from '@shared/components/icons/music/add-to-play-list-icon'
import type { AnimeSongWithImage } from 'types'
import { ToastType } from 'types'

interface Props {
  song: AnimeSongWithImage
  isInPlayList: boolean
  clasName?: string
  label?: string
  isCurrentSong?: boolean
}

type Action = {
  type: 'ADD' | 'REMOVE'
  song: AnimeSongWithImage
  index?: number
}

export const AddToPlayListButton = ({
  song,
  isInPlayList,
  clasName,
  label,
  isCurrentSong,
}: Props) => {
  const { list, setList } = useMusicPlayerStore()

  const executeAction = (action: Action) => {
    let newList: AnimeSongWithImage[] = []
    if (action.type === 'ADD') {
      if (typeof action.index === 'number') {
        newList = [...list]
        newList.splice(action.index, 0, action.song)
      } else {
        newList = [...list, action.song]
      }
    } else {
      newList = list.filter(
        (item: AnimeSongWithImage) => item.song_id !== action.song.song_id
      )
    }
    setList(newList)
  }

  const createUndoAction = (originalAction: Action): Action => {
    if (originalAction.type === 'ADD') {
      return {
        type: 'REMOVE',
        song: originalAction.song,
      }
    } else {
      return {
        type: 'ADD',
        song: originalAction.song,
        index: originalAction.index,
      }
    }
  }

  const performActionWithUndo = (action: Action) => {
    executeAction(action)

    const undoAction = createUndoAction(action)
    const actionText = action.type === 'ADD' ? 'added to' : 'removed from'

    toast[ToastType.Success]({
      text: `${action.song.song_title} ${actionText} playlist`,
      action: {
        content: 'Undo',
        onClick: () => {
          performActionWithUndo(undoAction)
        },
      },
    })
  }

  const handleClickList = () => {
    if (isInPlayList) {
      const currentIndex = list.findIndex(
        (item) => item.song_id === song.song_id
      )
      const action: Action = {
        type: 'REMOVE',
        song: { ...song },
        index: currentIndex !== -1 ? currentIndex : undefined,
      }
      performActionWithUndo(action)
    } else {
      const action: Action = {
        type: 'ADD',
        song: { ...song },
      }
      performActionWithUndo(action)
    }
  }

  return (
    <button
      className={clasName}
      title={`${isInPlayList ? 'Remove' : 'Add'} to playlist ${song.song_title}`}
      onClick={(e) => {
        e.stopPropagation()
        handleClickList()
      }}
      disabled={isCurrentSong}
    >
      {isInPlayList ? (
        <DeleteIcon className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <AddToPlayList className="h-4 w-4 md:h-5 md:w-5" />
      )}

      {label && <span className="font-medium">{label}</span>}
    </button>
  )
}
