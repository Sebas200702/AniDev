import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSong } from '@music/types'
import { useFetch } from '@shared/hooks/useFetch'
import { useEffect } from 'react'
import { usePlaylist } from './usePlaylist'

interface UseFetchMusicProps {
  theme_id: number | null
}

export const useFetchMusic = ({ theme_id }: UseFetchMusicProps) => {
  const { setCurrentSong, currentSongIndex } = useMusicPlayerStore()
  const { isInPlaylist, addToPlaylist, list } = usePlaylist()

  const { data, error, loading } = useFetch<AnimeSong>({
    url: `/music/getMusicInfo?theme_id=${theme_id}`,
    skip: theme_id === null,
  })

  useEffect(() => {
    if (!data || error || loading) return

    const exists = isInPlaylist(data)
    if (!exists) {
      addToPlaylist(data, currentSongIndex, true)
    }

    const song = exists ? list[currentSongIndex] : data

    setCurrentSong(song)
  }, [data, error, loading, currentSongIndex])
}
