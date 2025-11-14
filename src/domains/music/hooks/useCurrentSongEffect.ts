import type { MediaPlayerInstance } from '@vidstack/react'
import { normalizeString } from '@utils/normalize-string'
import { useEffect } from 'react'
import { useMusicPlayerStore } from '@music/stores/music-player-store'

type ChangingRefs = {
  isChangingSong: boolean
  prevSongId: string | null
}

export const useCurrentSongEffect = (
  player: React.RefObject<MediaPlayerInstance | null>,
  type: 'audio' | 'video',
  changingRefs: React.RefObject<ChangingRefs>
) => {
  const {
    currentSong,
    setSavedTime,
    setCurrentSong,
    setSrc,
    list,
    currentSongIndex,
    setCurrentSongIndex,
    isMinimized,
    setVariants,
    versions,
    versionNumber,
    savedTime,
    duration,
  } = useMusicPlayerStore()

  // Manejo de cambios de canción
  useEffect(() => {
    if (!currentSong) return

    const currentSongId = currentSong.song_id

    if (
      changingRefs.current.prevSongId &&
      changingRefs.current.prevSongId !== currentSongId.toString()
    ) {
      changingRefs.current.isChangingSong = true
      setSavedTime(0)

      if (player.current) player.current.currentTime = 0
    }

    changingRefs.current.prevSongId = currentSongId.toString()

    if (type === 'audio') setSrc(currentSong.audio_url)
    if (type === 'video') setSrc(currentSong.video_url)
  }, [currentSong, type, setSrc, setSavedTime, player])

  // Auto-siguiente canción
  useEffect(() => {
    if (
      savedTime !== duration ||
      currentSongIndex + 1 === list.length ||
      duration === 0
    )
      return

    const nextSong = list[currentSongIndex + 1]
    if (!nextSong) return

    changingRefs.current.isChangingSong = true
    setCurrentSong(nextSong)
    setCurrentSongIndex(currentSongIndex + 1)
    setSavedTime(0)

    if (!isMinimized) {
      const newUrl = `/music/${normalizeString(
        nextSong.song_title
      )}_${nextSong.theme_id}`
      import('@music/utils/sycronize-player-metadata').then((module) => {
        module.SyncronizePlayerMetadata({
          title: nextSong.song_title,
          url: newUrl,
        })
      })
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

  // Cambios de versión
  useEffect(() => {
    if (!currentSong || changingRefs.current.isChangingSong) return

    const newVersion = versions.find(
      (version) => version.version === versionNumber
    )

    if (newVersion && newVersion.song_id !== currentSong.song_id) {
      changingRefs.current.isChangingSong = true
      setCurrentSong(newVersion)
      setVariants(
        versions.filter((s) => s.version_id === newVersion.version_id)
      )
    }
  }, [versionNumber, currentSong, versions, setCurrentSong, setVariants])
}
