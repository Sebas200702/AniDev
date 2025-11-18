import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSongWithImage } from '@music/types'
import { createImageUrlProxy } from '@shared/utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { MediaPlayerInstance } from '@vidstack/react'
import { useEffect } from 'react'

type ChangingRefs = {
  isChangingSong: boolean
  prevSongId: string | null
}

export const useMediaSession = (
  player: React.RefObject<MediaPlayerInstance | null>,
  playing: boolean,
  changingRefs: React.RefObject<ChangingRefs>
) => {
  const {
    currentSong,
    list,
    currentSongIndex,
    isMinimized,
    setSavedTime,
    setCurrentSong,
  } = useMusicPlayerStore()

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return

    const { mediaSession } = navigator

    mediaSession.metadata = new MediaMetadata({
      title: currentSong.song_title,
      artist: currentSong.artist_name || '',
      artwork: [
        {
          src: createImageUrlProxy(currentSong.image || ''),
          sizes: '192x192',
          type: 'image/jpeg',
        },
      ],
    })

    mediaSession.playbackState = playing ? 'playing' : 'paused'

    const changeSong = (song: AnimeSongWithImage) => {
      changingRefs.current.isChangingSong = true
      setSavedTime(0)
      setCurrentSong(song)
      if (player.current) player.current.currentTime = 0

      if (!isMinimized) {
        const newUrl = `/music/${normalizeString(song.song_title)}_${song.theme_id}`
        import('@music/utils/sycronize-player-metadata').then((module) => {
          module.SyncronizePlayerMetadata({
            title: song.song_title,
            url: newUrl,
          })
        })
      }
    }

    mediaSession.setActionHandler(
      'previoustrack',
      currentSongIndex > 0 ? () => changeSong(list[currentSongIndex - 1]) : null
    )

    mediaSession.setActionHandler(
      'nexttrack',
      currentSongIndex + 1 < list.length
        ? () => changeSong(list[currentSongIndex + 1])
        : null
    )

    mediaSession.setActionHandler('play', () => player.current?.play())
    mediaSession.setActionHandler('pause', () => player.current?.pause())
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
    list,
    playing,
    isMinimized,
    setSavedTime,
    setCurrentSong,
    player,
  ])
}
