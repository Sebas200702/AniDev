import { AnimeTypes } from 'types'

export const typeColors = (type: string) => {
  if (type === AnimeTypes.TV) return 'text-emerald-700 '
  if (type === AnimeTypes.OVA) return 'text-green-500 '
  if (type === AnimeTypes.MOVIE) return 'text-purple-500 '
  if (type === AnimeTypes.SPECIAL) return 'text-yellow-500 '
  if (type === AnimeTypes.ONA) return 'text-red-500 '
  if (type === AnimeTypes.PV) return 'text-orange-500 '
  if (type === AnimeTypes.CM) return 'text-indigo-600 '
  return 'text-Primary-50'
}
