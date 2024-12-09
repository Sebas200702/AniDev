export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://animeflix.vercel.app'
    : 'http://localhost:4321'

export const getAnimeType = (type: string) => {
  if (type === 'tv') return 'Anime'
  else if (type === 'movie') return 'Movie'
  else if (type === 'ova') return 'OVA'
  else if (type === 'special') return 'Special'
  else return 'Anime'
}
export const normalizeString = (str: string) => {
  return str.replace(/[?¡.:,;¿!]/g, '')
}
