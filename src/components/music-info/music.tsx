import { useMusicPlayerStore } from '@store/music-player-store'
import { useEffect } from 'react'
export const Music = ({ themeId }: { themeId: string }) => {
  const {
    currentSong,
    setCurrentSong,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setIsLoading,
    setError,
  } = useMusicPlayerStore()
  useEffect(() => {
    setIsPlaying(false)
    const fetchMusic = async () => {
      const response = await fetch(`/api/getMusicInfo?themeId=${themeId}`)
      const data = await response.json()

      if (data[0].song_id === currentSong?.song_id) {
        console.log('song is the same')
        return
      }

      setCurrentSong(data[0])

      setCurrentTime(0)
      setDuration(0)
      setIsLoading(false)
      setError(null)
      setIsPlaying(true)
    }
    fetchMusic()
  }, [])

  return null
}
