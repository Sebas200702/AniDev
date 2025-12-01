import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSong } from '@music/types'
import { toast } from '@pheralb/toast'
import { Picture } from '@shared/components/media/picture'
import { ToastType } from '@shared/types'
import { shuffleArray } from '@utils/shuffle-array'

export const usePlaylist = () => {
  const {
    list,
    setList,
    currentSongIndex,
    setCurrentSong,
    setCurrentSongIndex,
    setRepeat,
    repeat,
  } = useMusicPlayerStore()

  const upComingList = list.slice(currentSongIndex + 1)
  const previousList = list.slice(0, currentSongIndex)
  const hasNext = currentSongIndex + 1 < list.length
  const hasPrev = currentSongIndex > 0
  const canShuffle = upComingList.length > 1
  const isRepeat = repeat

  const addToPlaylist = (song: AnimeSong, position?: number) => {
    const newList = [...list]
    newList.splice(position ?? list.length, 0, song)

    setList(newList)

    toast[ToastType.Info]({
      text: `${song.song_title} added to playlist.`,
      action: {
        content: 'Undo',
        onClick: () => {
          removeFromPlaylist(song)
        },
      },
      icon: (
        <Picture
          image={song.anime?.image ?? ''}
          placeholder={song.anime?.image ?? ''}
          alt={song.song_title ?? 'Unknown Song'}
          styles="relative mr-2 aspect-[225/330] w-10 rounded-sm md:w-12"
        />
      ),
    })
  }
  const removeFromPlaylist = (song: AnimeSong) => {
    const newList = list.filter((s) => s.theme_id !== song.theme_id)
    setList(newList)
    toast[ToastType.Info]({
      text: `${song.song_title} removed from playlist.`,
      action: {
        content: 'Undo',
        onClick: () => {
          addToPlaylist(song)
        },
      },
      icon: (
        <Picture
          image={song.anime?.image ?? ''}
          placeholder={song.anime?.image ?? ''}
          alt={song.song_title ?? 'Up Next Song'}
          styles="relative mr-2 aspect-[225/330] w-10 rounded-sm md:w-12"
        />
      ),
    })
  }
  const handleNextSong = () => {
    if (!hasNext) {
      return handleRepeat()
    }
    setCurrentSongIndex(currentSongIndex + 1)
    setCurrentSong(list[currentSongIndex + 1])
  }
  const handlePrevSong = () => {
    if (!hasPrev) return
    setCurrentSongIndex(currentSongIndex - 1)
    setCurrentSong(list[currentSongIndex - 1])
  }
  const clearPlaylist = () => {
    setList([])
    setCurrentSong(null)
  }
  const isInplaylist = (song: AnimeSong) => {
    return list.some((s) => s.theme_id === song.theme_id)
  }
  const isCurrentSong = (song: AnimeSong) => {
    return list[currentSongIndex]?.theme_id === song.theme_id
  }
  const updateList = (newUpComingList: AnimeSong[]) => {
    const currentSong = list[currentSongIndex]
    const newList = [...previousList, currentSong, ...newUpComingList]
    setList(newList)
  }
  const shuffleList = () => {
    const shuffled = shuffleArray(upComingList)
    updateList(shuffled)
  }

  const toggleRepeat = () => {
    setRepeat(!repeat)
  }
  const handleRepeat = () => {
    if (!isRepeat) return
    setCurrentSongIndex(0)
  }

  return {
    addToPlaylist,
    removeFromPlaylist,
    handleNextSong,
    handlePrevSong,
    clearPlaylist,
    isInplaylist,
    upComingList,
    list,
    updateList,
    shuffleList,
    isRepeat,
    toggleRepeat,
    isCurrentSong,
    canShuffle,
    currentSongIndex,
    hasNext,
    hasPrev,
  }
}
