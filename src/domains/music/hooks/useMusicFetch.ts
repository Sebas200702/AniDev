import { clientLogger } from '@libs/logger'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSongWithImage } from '@music/types'

const logger = clientLogger.create('useMusicFetch')

export const useMusicFetch = () => {
  const {
    list,
    currentSong,
    currentSongIndex,
    setList,
    setCurrentSong,
    setCurrentSongIndex,
    setVariants,
    setVersionNumber,
    setVersions,
    setError,
  } = useMusicPlayerStore()

  const fetchMusic = async (themeId?: string | null) => {
    if (!themeId) return

    try {
      const res = await fetch(`/api/music/getMusicInfo?themeId=${themeId}`)
      const data: AnimeSongWithImage[] = await res.json()
      if (!data?.length) {
        setError('No se encontró música para este tema')
        return
      }

      const newSong = data[0]

      // Si la canción actual es la misma que se está fetcheando, solo actualizar variants
      if (currentSong && currentSong.song_id === newSong.song_id) {
        setVariants(data.filter((s) => s.version_id === newSong.version_id))
        setVersionNumber(newSong.version)
        setVersions([...new Map(data.map((s) => [s.version_id, s])).values()])
        setError(null)
        return
      }

      const existingIndex = list.findIndex((s) => s.song_id === newSong.song_id)

      // Actualizar variants, versions y versionNumber siempre
      setVariants(data.filter((s) => s.version_id === newSong.version_id))
      setVersionNumber(newSong.version)
      setVersions([...new Map(data.map((s) => [s.version_id, s])).values()])
      setError(null)

      // Si la canción ya existe en la lista
      if (existingIndex !== -1) {
        // Solo cambiar la canción actual sin modificar la lista
        setCurrentSong(list[existingIndex])
        setCurrentSongIndex(existingIndex)
        return
      }

      // Si es una canción nueva
      if (list.length === 0 || !currentSong) {
        // Primera canción o lista vacía
        setList([newSong])
        setCurrentSong(newSong)
        setCurrentSongIndex(0)
      } else {
        // Insertar nueva canción justo después de la actual
        const updatedList = [
          ...list.slice(0, currentSongIndex + 1),
          newSong,
          ...list.slice(currentSongIndex + 1),
        ]

        setList(updatedList)
        setCurrentSong(newSong)
        setCurrentSongIndex(currentSongIndex + 1)
      }
    } catch (err) {
      logger.error(err)
      setError('Error al cargar la música')
    }
  }

  return { fetchMusic }
}
