import { AnimeTypes } from 'types'

export const getAnimeType = (type?: string) => {
  if (!type) return 'Unknown'
  const typeNormalized = type.toLowerCase()

  if (typeNormalized === AnimeTypes.TV.toLowerCase()) return 'Anime'
  if (typeNormalized === AnimeTypes.OVA.toLowerCase()) return 'OVA'
  if (typeNormalized === AnimeTypes.MOVIE.toLowerCase()) return 'Movie'
  if (typeNormalized === AnimeTypes.SPECIAL.toLowerCase()) return 'Special'
  if (typeNormalized === AnimeTypes.ONA.toLowerCase()) return 'ONA'
  if (typeNormalized === AnimeTypes.TV_SPECIAL.toLowerCase()) return 'Special'
  if (typeNormalized === AnimeTypes.MUSIC.toLowerCase()) return 'Music'
  if (typeNormalized === AnimeTypes.PV.toLowerCase()) return 'PV'
  if (typeNormalized === AnimeTypes.CM.toLowerCase()) return 'CM'
  return 'Unknown'
}
