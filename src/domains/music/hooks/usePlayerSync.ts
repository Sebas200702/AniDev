import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { MediaPlayerInstance } from '@vidstack/react'

import { type RefObject, useEffect } from 'react'
interface UsePlayBackProps {
  playing: boolean
  time: number
  duration: number
  canPlay?: boolean
  player: RefObject<MediaPlayerInstance | null>
}
export const usePlayerSync = ({
  playing,
  time,
  duration,
  canPlay,
  player,
}: UsePlayBackProps) => {
  const {
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    setDuration,
    currentTime,
    type,
    selectedVersion,
    selectedResolutionId,
    currentSongIndex,
    savedTime,
    setSavedTime,
  } = useMusicPlayerStore()


  useEffect(() => {
    if (time <= 0) return
    setCurrentTime(time)
  }, [time])

  useEffect(() => {
    setSavedTime(currentTime)
  }, [currentTime])

  useEffect(() => {
    if (!player?.current) return
    player.current.currentTime = savedTime
    setCurrentTime(savedTime)
  }, [type, selectedVersion, selectedResolutionId, savedTime])

  useEffect(() => {
    if (!player?.current) return
    setCurrentTime(0)
    setSavedTime(0)
    player.current.currentTime = 0
  }, [currentSongIndex ,])

  useEffect(() => {
    setDuration(duration)
  }, [duration])
  useEffect(() => {
    if (playing !== isPlaying && canPlay) {
      setIsPlaying(playing)
    }
  }, [playing])
}
