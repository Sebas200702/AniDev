import type { AnimeSongWithImage } from '@music/types'

/**
 * Extrae la información de las últimas canciones (OP y ED) de cada anime
 * @param songs - Array de canciones con imágenes
 * @param banners - Si es true, devuelve solo las URLs de banners. Si es false, devuelve la info completa
 * @returns Array de URLs de banners o información completa de las últimas canciones
 */
export function getLatestSongs(
  songs: AnimeSongWithImage[],
  banners: boolean = false
) {
  const validSongs = banners
    ? songs.filter(
        (song) => song.banner_image && song.banner_image.trim() !== ''
      )
    : songs

  const songsByAnimeAndType = validSongs.reduce(
    (acc, song) => {
      const key = `${song.anime_id}-${song.type}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(song)
      return acc
    },
    {} as Record<string, AnimeSongWithImage[]>
  )

  const latestSongs: AnimeSongWithImage[] = []

  Object.values(songsByAnimeAndType).forEach((animeSongs) => {
    const songsWithSequence = animeSongs.filter(
      (song) => song.sequence !== null
    )

    if (songsWithSequence.length > 0) {
      const latestSong = songsWithSequence.reduce((latest, current) =>
        current.sequence! > latest.sequence! ? current : latest
      )
      latestSongs.push(latestSong)
    } else if (animeSongs.length > 0) {
      latestSongs.push(animeSongs[0])
    }
  })

  if (banners) {
    const uniqueBanners = [
      ...new Set(latestSongs.map((song) => song.banner_image)),
    ]
    return uniqueBanners
  } else {
    return latestSongs
  }
}
