import { usePlaylist } from '@music/hooks/usePlaylist'
import type { AnimeSong } from '@music/types'
import { DeleteIcon } from '@shared/components/icons/common/delete-icon'
import { AddToPlayList } from '@shared/components/icons/music/add-to-play-list-icon'

interface Props {
  song: AnimeSong
  isInPlayList: boolean
  className?: string
  label?: string
  isCurrentSong?: boolean
}

export const AddToPlayListButton = ({
  song,
  isInPlayList,
  className,
  label,
  isCurrentSong,
}: Props) => {
  const { addToPlaylist, removeFromPlaylist } = usePlaylist()

  const handleClickList = () => {
    if (isInPlayList) {
      removeFromPlaylist(song)
    } else {
      addToPlaylist(song)
    }
  }

  return (
    <button
      className={className}
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
