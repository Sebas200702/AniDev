import { usePlaylist } from '@music/hooks/usePlaylist'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { savedTimeUtils } from '@music/utils/saved-time'
import { useEffect } from 'react'
export const usePlayback = () => {
  const {
    isPlaying,
    setIsPlaying,
    canPlay,
    currentSong,
    duration,
    currentTime,
    setCurrentTime,
    repeat,
    list,

    playerRef,
  } = useMusicPlayerStore()
  const { handleNextSong } = usePlaylist()

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (currentTime >= duration && duration > 0) {
      if (repeat && list.length === 1) {
        setCurrentTime(0)
        savedTimeUtils.setSavedTime(0)
        if (playerRef?.current) {
          playerRef.current.currentTime = 0
          playerRef.current.play?.()
        }
        setIsPlaying(true)
      } else {
        savedTimeUtils.setSavedTime(0)
        handleNextSong()
      }
    }
  }, [
    currentTime,
    duration,
    repeat,
    list.length,
    setCurrentTime,
    setIsPlaying,
    handleNextSong,
    playerRef,
  ])

  return {
    togglePlay,
    canPlay,
    currentSong,
    isPlaying,
  }
}
