import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { useEffect } from 'react'
import { usePlaylist } from './usePlaylist'
export const usePlayback = () => {
  const {
    isPlaying,
    setIsPlaying,
    canPlay,
    currentSong,
    duration,
    currentTime,
    setSavedTime,
  } = useMusicPlayerStore()
  const { handleNextSong } = usePlaylist()

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (currentTime >= duration && duration > 0) {
      setSavedTime(0)
      handleNextSong()
    }
  }, [currentTime])

  return {
    togglePlay,
    canPlay,
    currentSong,
    isPlaying,
  }
}
