import { useMusicPlayerStore } from '@store/music-player-store'
import { useEffect } from 'react'

export const Music = ({ themeId }: { themeId: string }) => {
  const {
    setCurrentSong,
    setError,
    setIsHidden,
    setIsMinimized,
    setVariants,
    setSavedTime,
    list,
    setList,
    currentSongIndex,
    currentSong,
  } = useMusicPlayerStore()

  useEffect(() => {
    const fetchMusic = async () => {
      setIsHidden(false)
      setIsMinimized(false)

      try {
        const response = await fetch(`/api/getMusicInfo?themeId=${themeId}`)
        const data = await response.json()

        if (!data || !Array.isArray(data) || data.length === 0) {
          setError('No se encontró música para este tema')
          return
        }

        const newSong = data[0]

        const existingSongIndex = list.findIndex(
          (song) => song.song_id === newSong.song_id
        )

        if (existingSongIndex !== -1) {
          setCurrentSong(newSong)
          setSavedTime(0)
          setVariants(data)
          setError(null)
          return
        }

        let updatedList

        if (list.length === 0) {
          updatedList = [newSong]
        } else {
          const playedSongs = list.slice(0, currentSongIndex + 1)

          const remainingSongs = list.slice(currentSongIndex + 1)

          updatedList = [...playedSongs, newSong, ...remainingSongs]
        }

        setList(updatedList)
        setVariants(data)

        setCurrentSong(newSong)
        setSavedTime(0)

        setError(null)
      } catch (error) {
        console.error('Error fetching music:', error)
        setError('Error al cargar la música')
      }
    }

    fetchMusic()
  }, [themeId])

  return null
}
