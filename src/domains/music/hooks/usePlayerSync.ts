import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { MediaPlayerInstance } from '@vidstack/react'
import { throttle } from '@utils/throttle'

import { type RefObject, useEffect, useMemo, useRef } from 'react'

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
    type,
    selectedVersion,
    selectedResolutionId,
    currentSongIndex,
  } = useMusicPlayerStore()

  const savedTimeRef = useRef(0)
  const throttledSetCurrentTime = useMemo(
    () =>
      throttle((newTime: number) => {
        setCurrentTime(newTime)
      }, 200),
    [setCurrentTime]
  )

  useEffect(() => {
    if (time <= 0) return
    throttledSetCurrentTime(time)
    savedTimeRef.current = time
  }, [time, throttledSetCurrentTime])

  useEffect(() => {
    if (!player?.current) return
    player.current.currentTime = savedTimeRef.current
    setCurrentTime(savedTimeRef.current)
  }, [type, selectedVersion, selectedResolutionId, setCurrentTime])

  useEffect(() => {
    if (!player?.current) return
    savedTimeRef.current = 0
    setCurrentTime(0)
    player.current.currentTime = 0
  }, [currentSongIndex, setCurrentTime])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (savedTimeRef.current > 0) {
        localStorage.setItem(
          'music-player-saved-time',
          savedTimeRef.current.toString()
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)

      handleBeforeUnload()
    }
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('music-player-saved-time')
    if (saved && player?.current) {
      const savedTime = Number.parseFloat(saved)
      savedTimeRef.current = savedTime
      player.current.currentTime = savedTime
      setCurrentTime(savedTime)

      sessionStorage.removeItem('music-player-saved-time')
    }
  }, [])

  useEffect(() => {
    setDuration(duration)
  }, [duration, setDuration])

  useEffect(() => {
    if (playing !== isPlaying && canPlay) {
      setIsPlaying(playing)
    }
  }, [playing, isPlaying, canPlay, setIsPlaying])
}
