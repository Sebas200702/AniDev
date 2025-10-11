import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSongWithImage } from '@music/types'

export const useMusicFetch = () => {
  const {
    list,
    currentSong,
    currentSongIndex,
    setList,
    setCurrentSong,
    setVariants,
    setVersionNumber,
    setVersions,
    setError,
  } = useMusicPlayerStore()

  const fetchMusic = async (themeId?: string | null) => {
    if (!themeId) return

    try {
      const res = await fetch(`/api/getMusicInfo?themeId=${themeId}`)
      const data: AnimeSongWithImage[] = await res.json()
      if (!data?.length) {
        setError('No se encontró música para este tema')
        return
      }

      const newSong = data[0]
      const existingIndex = list.findIndex((s) => s.song_id === newSong.song_id)

      if (existingIndex !== -1) {
        setVariants(data.filter((s) => s.version_id === newSong.version_id))
        setVersionNumber(newSong.version)
        setVersions([...new Map(data.map((s) => [s.version_id, s])).values()])
        setError(null)
        return
      }

      const updatedList =
        list.length === 0 || !currentSong
          ? [newSong]
          : [
              ...list.slice(0, currentSongIndex + 1),
              newSong,
              ...list.slice(currentSongIndex + 2),
            ]

      setList(updatedList)
      if (!currentSong) setCurrentSong(newSong)
      setVariants(data.filter((s) => s.version_id === newSong.version_id))
      setVersionNumber(newSong.version)
      setVersions([...new Map(data.map((s) => [s.version_id, s])).values()])
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Error al cargar la música')
    }
  }

  return { fetchMusic }
}
