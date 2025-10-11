import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { MediaPlayerInstance } from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { useCurrentSongEffect } from './useCurrentSongEffect'
import { useMediaSession } from './useMediaSession'
import { useMusicFetch } from './useMusicFetch'
import { usePlaybackSync } from './usePlaybackSync'
import { useThemeId } from './useThemeId'

type ChangingRefs = {
  isChangingSong: boolean
  prevSongId: string | null
}

export const useMusicPlayerSync = (
  currentTime: number,
  playing: boolean,
  player: React.RefObject<MediaPlayerInstance | null>,
  canPlay: boolean,
  duration: number
) => {
  const changingRefs = useRef<ChangingRefs>({
    isChangingSong: false,
    prevSongId: null,
  })
  const themeId = useThemeId()

  const {
    setSavedTime,
    setIsPlaying,
    setPlayerRef,
    setDuration,
    currentSong,
    setCanPlay,
    type,
  } = useMusicPlayerStore()
  const { fetchMusic } = useMusicFetch()

  // Actualiza si puede reproducir
  useEffect(() => {
    setCanPlay(canPlay)
  }, [canPlay, setCanPlay])

  // Guarda ref del player
  useEffect(() => {
    if (player) setPlayerRef(player)
  }, [player, setPlayerRef])

  // Sincronización de reproducción general
  usePlaybackSync({
    currentTime,
    playing,
    duration,
    setSavedTime,
    setIsPlaying,
  })

  // Efectos principales de cambio de canción y versiones

  useCurrentSongEffect(player, type, changingRefs)

  // Control del MediaSession API
  useMediaSession(player, playing, changingRefs)

  // Actualiza duración
  useEffect(() => {
    setDuration(duration)
  }, [duration, setDuration])
  useEffect(() => {
    if (themeId) fetchMusic(themeId)
  }, [themeId || currentSong?.theme_id])
}
