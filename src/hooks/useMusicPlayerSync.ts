import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import { SyncronizePlayerMetadata } from '@utils/sycronize-player-metadata'
import type { MediaPlayerInstance } from '@vidstack/react'
import { useEffect, useRef, version } from 'react'
import type { AnimeSongWithImage } from 'types'

export const useMusicPlayerSync = (
  currentTime: number,
  playing: boolean,
  player: React.RefObject<MediaPlayerInstance | null>,
  canPlay: boolean,
  duration: number
) => {
  const {
    currentSong,
    setSavedTime,
    type,
    setSrc,
    setIsPlaying,
    setPlayerRef,
    setCanPlay,
    setDuration,
    list,
    setCurrentSong,
    setCurrentSongIndex,
    currentSongIndex,
    isMinimized,
    setVersions,
    setVersionNumber,
    versionNumber,
    setError,
    setVariants,
    setList,
    versions,

    savedTime,
  } = useMusicPlayerStore()

  const previousSongId = useRef<string | null>(null)
  const isChangingSong = useRef(false)
  const mediaUpdateInterval = useRef<number | null>(null)

  const getThemeIdFromPath = () => {
    if (typeof window === 'undefined') return
    if (window.location.pathname.includes('/music')) {
      return window.location.pathname.split('_')[1]
    }
    return null
  }

  const themeId = getThemeIdFromPath()

  useEffect(() => {
    const fetchMusic = async () => {
      if (!themeId) return

      try {
        const response = await fetch(`/api/getMusicInfo?themeId=${themeId}`)
        const data = await response.json()
        console.log('Fetched music data:', data)

        if (!data || !Array.isArray(data) || data.length === 0) {
          setError('No se encontró música para este tema')
          return
        }

        const newSong = data[0]

        const existingSongIndex = list.findIndex(
          (song) => song.song_id === newSong.song_id
        )

        if (existingSongIndex !== -1) {
          setVariants(
            data.filter((song) => song.version_id === newSong.version_id)
          )
          setVersionNumber(newSong.version)

          const uniqueVersions = data.filter(
            (song, index, self) =>
              self.findIndex((s) => s.version_id === song.version_id) === index
          )

          setVersions(uniqueVersions)
          setError(null)
          return
        }

        if (list.length === 0 || !currentSong) {
          const updatedList = [newSong]
          setList(updatedList)
          setCurrentSong(newSong)

        }else{
          const playedSongs = list.slice(0, currentSongIndex-1)
          const remainingSongs = list.slice(currentSongIndex)
          const updatedList = [...playedSongs, newSong, ...remainingSongs]
          setList(updatedList)
        
        }

        setVariants(
          data.filter((song) => song.version_id === newSong.version_id)
        )
        setVersionNumber(newSong.version)

        const uniqueVersions = data.filter(
          (song, index, self) =>
            self.findIndex((s) => s.version_id === song.version_id) === index
        )

        setVersions(uniqueVersions)
        setError(null)
      } catch (error) {
        console.error('Error fetching music:', error)
        setError('Error al cargar la música')
      }
    }

    if (!isChangingSong.current) {
      console.log('themeId', themeId)
      fetchMusic()
    }
  }, [themeId])

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong || !playing) {
      if (mediaUpdateInterval.current) {
        window.clearInterval(mediaUpdateInterval.current)
        mediaUpdateInterval.current = null
      }
      return
    }

    const updateMediaPosition = () => {
      if (duration > 0 && player.current) {
        try {
          navigator.mediaSession.setPositionState({
            duration,
            position: player.current.currentTime,
            playbackRate: player.current.playbackRate || 1.0,
          })
        } catch (error) {
          console.warn('Error updating media session position:', error)
        }
      }
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
        window.clearInterval(mediaUpdateInterval.current)
        mediaUpdateInterval.current = null
      }
    }
  }, [playing, currentSong, duration, player])

  useEffect(() => {
    const songIndex = list.findIndex(
      (song) => song.song_id === currentSong?.song_id
    )
    setCurrentSongIndex(songIndex)
  }, [currentSong, setCurrentSongIndex, list])

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return

    const { mediaSession } = navigator

    mediaSession.metadata = new MediaMetadata({
      title: currentSong.song_title,
      artist: currentSong.artist_name || '',
      artwork: [
        {
          src: currentSong.image || '',
          sizes: '192x192',
          type: 'image/jpeg',
        },
      ],
    })

    mediaSession.playbackState = playing ? 'playing' : 'paused'

    const changeSong = (song: AnimeSongWithImage) => {
      isChangingSong.current = true
      setSavedTime(0)
      setCurrentSong(song)

      if (player.current) {
        player.current.currentTime = 0
      }

      if (!isMinimized) {
        const newUrl = `/music/${normalizeString(song.song_title)}_${song.theme_id}`
        SyncronizePlayerMetadata({ title: song.song_title, url: newUrl })
      }
    }

    const hasPreviousSong = currentSongIndex > 0
    mediaSession.setActionHandler(
      'previoustrack',
      hasPreviousSong ? () => changeSong(list[currentSongIndex - 1]) : null
    )

    const hasNextSong = currentSongIndex + 1 < list.length
    mediaSession.setActionHandler(
      'nexttrack',
      hasNextSong ? () => changeSong(list[currentSongIndex + 1]) : null
    )

    mediaSession.setActionHandler('play', () => {
      if (player.current) {
        player.current.play()
      }
    })

    mediaSession.setActionHandler('pause', () => {
      if (player.current) {
        player.current.pause()
      }
    })

    mediaSession.setActionHandler('seekto', (details) => {
      if (player.current && details.seekTime !== undefined) {
        player.current.currentTime = details.seekTime
        setSavedTime(details.seekTime)
      }
    })

    return () => {
      mediaSession.setActionHandler('previoustrack', null)
      mediaSession.setActionHandler('nexttrack', null)
      mediaSession.setActionHandler('play', null)
      mediaSession.setActionHandler('pause', null)
      mediaSession.setActionHandler('seekto', null)
    }
  }, [
    currentSong,
    currentSongIndex,
    playing,
    list,
    isMinimized,
    setCurrentSong,
    setSavedTime,
    player,
  ])

  useEffect(() => {
    if (!currentSong) return

    const currentSongId = currentSong.song_id

    if (
      previousSongId.current &&
      previousSongId.current !== currentSongId.toString()
    ) {
      isChangingSong.current = true
      setSavedTime(0)

      if (player.current) {
        player.current.currentTime = 0
      }
    }

    previousSongId.current = currentSongId.toString()

    if (type === 'audio') {
      setSrc(currentSong.audio_url)
    }
    if (type === 'video') {
      setSrc(currentSong.video_url)
    }
  }, [currentSong, type, setSrc, setSavedTime, player])

  useEffect(() => {
    if (player) setPlayerRef(player)
  }, [player, setPlayerRef])

  useEffect(() => {
    setCanPlay(canPlay)
  }, [canPlay, setCanPlay])

  useEffect(() => {
    if (
      savedTime !== duration ||
      currentSongIndex + 1 === list.length ||
      duration === 0
    )
      return

    const nextSong = list[currentSongIndex + 1]
    if (!nextSong) return

    isChangingSong.current = true
    setCurrentSong(nextSong)
    setSavedTime(0)

    if (!isMinimized) {
      const newUrl = `/music/${normalizeString(nextSong.song_title)}_${nextSong.theme_id}`
      SyncronizePlayerMetadata({ title: nextSong.song_title, url: newUrl })
    }
  }, [
    savedTime,
    duration,
    currentSongIndex,
    list,
    setCurrentSong,
    setSavedTime,
    isMinimized,
  ])

  useEffect(() => {
    if (currentTime && !isChangingSong.current) {
      setSavedTime(currentTime)
    } else if (isChangingSong.current && currentTime === 0) {
      isChangingSong.current = false
    }
  }, [currentTime, setSavedTime])

  useEffect(() => {
    setIsPlaying(playing)
  }, [playing, setIsPlaying])

  useEffect(() => {
    setDuration(duration)
  }, [duration, setDuration])

  useEffect(() => {
    if (!currentSong || isChangingSong.current) return

    const newVersion = versions.find(
      (version) => version.version === versionNumber
    )

    // Solo cambiar la versión si es diferente a la actual
    if (newVersion && newVersion.song_id !== currentSong.song_id) {
      isChangingSong.current = true
      setCurrentSong(newVersion)
      setVariants(
        versions.filter((song) => song.version_id === newVersion.version_id)
      )
    }
  }, [versionNumber, currentSong, versions])
}
