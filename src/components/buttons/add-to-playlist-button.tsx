import { AddToPlayList } from '@components/icons/add-to-play-list-icon'
import { DeleteIcon } from '@components/icons/delete-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import type { AnimeSongWithImage } from 'types'

interface Props {
  song: AnimeSongWithImage
  isInPlayList: boolean
  clasName?: string
  label?: string
}

export const AddToPlayListButton = ({
  song,
  isInPlayList,
  clasName,
  label,
}: Props) => {
  const handleAddTolist = (newSong: AnimeSongWithImage) => {
    setList([...list, newSong])
  }
  const { list, setList } = useMusicPlayerStore()
  const handleClickList = () => {
    if (!isInPlayList) {
      handleAddTolist(song)
      return
    }
    const index = list.findIndex((item) => item.song_id === song.song_id)

    handleRemoveTolist(index)
  }
  const handleRemoveTolist = (indexToDelete: number) => {
    setList([...list].filter((_, index) => index !== indexToDelete))
  }
  return (
    <button
      className={clasName}
      title={`${isInPlayList ? 'Remove' : 'Add'} to playlist ${song.song_title}`}
      onClick={(e) => {
        e.stopPropagation()
        handleClickList()
      }}
    >
      {isInPlayList ? (
        <DeleteIcon className="h-4 w-4 xl:h-5 xl:w-5" />
      ) : (
        <AddToPlayList className="h-4 w-4 xl:h-5 xl:w-5" />
      )}

      {label && <span className='font-medium' >{label}</span>}
    </button>
  )
}
