import { useEffect, useRef } from 'react'

type PlaybackSyncProps = {
  currentTime: number
  playing: boolean
  duration: number
  setSavedTime: (time: number) => void
  setIsPlaying: (state: boolean) => void
}

export const usePlaybackSync = ({
  currentTime,
  playing,
  duration,
  setSavedTime,
  setIsPlaying,
}: PlaybackSyncProps) => {
  const mediaUpdateInterval = useRef<number | null>(null)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    const updateMediaPosition = () => {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          position: currentTime,
          playbackRate: 1.0,
        })
      } catch {}
    }

    if (playing) {
      updateMediaPosition()
      mediaUpdateInterval.current = window.setInterval(
        updateMediaPosition,
        1000
      )
    }

    return () => {
      if (mediaUpdateInterval.current) {
        clearInterval(mediaUpdateInterval.current)
        mediaUpdateInterval.current = null
      }
    }
  }, [playing, duration, currentTime])

  // Guarda progreso
  useEffect(() => {
    setSavedTime(currentTime)
  }, [currentTime, setSavedTime])

  // Estado de reproducción
  useEffect(() => {
    setIsPlaying(playing)
  }, [playing, setIsPlaying])
}
