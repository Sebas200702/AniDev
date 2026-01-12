import { AnimeGenres, AnimeTypes } from '@anime/types'

const GENRE_COLORS: Record<string, string> = {
  [AnimeGenres.ACTION]: 'md:group-hover:text-red-300',
  [AnimeGenres.ADVENTURE]: 'md:group-hover:text-enfasisColor',
  [AnimeGenres.GIRLS_LOVE]: 'md:group-hover:text-purple-300',
  [AnimeGenres.COMEDY]: 'md:group-hover:text-yellow-300',
  [AnimeGenres.DRAMA]: 'md:group-hover:text-purple-400',
  [AnimeGenres.ROMANCE]: 'md:group-hover:text-pink-300',
  [AnimeGenres.SCI_FI]: 'md:group-hover:text-indigo-300',
  [AnimeGenres.SLICE_OF_LIFE]: 'md:group-hover:text-green-300',
  [AnimeGenres.SPORTS]: 'md:group-hover:text-orange-300',
  [AnimeGenres.FANTASY]: 'md:group-hover:text-pink-400',
  [AnimeGenres.MYSTERY]: 'md:group-hover:text-yellow-200',
  [AnimeGenres.HORROR]: 'md:group-hover:text-red-400',
}

const STATUS_COLORS: Record<string, string> = {
  'Currently Airing': 'bg-green-400 md:group-hover:bg-green-500',
  'Finished Airing': 'bg-blue-500 md:group-hover:bg-blue-600',
  'Not yet aired': 'bg-yellow-500 md:group-hover:bg-yellow-600',
  unknown: 'bg-gray-400 md:group-hover:bg-gray-500',
}

export const ColorService = {
  getGenreColor(genre: string): string {
    return GENRE_COLORS[genre] || 'md:group-hover:text-gray-300'
  },

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || STATUS_COLORS['unknown']
  },

  getTypeColor(type: string): string {
    if (type === AnimeTypes.TV) return 'text-emerald-700 '
    if (type === AnimeTypes.OVA) return 'text-green-500 '
    if (type === AnimeTypes.MOVIE) return 'text-purple-500 '
    if (type === AnimeTypes.SPECIAL || type === AnimeTypes.TV_SPECIAL)
      return 'text-yellow-500 '
    if (type === AnimeTypes.ONA) return 'text-red-500 '
    if (type === AnimeTypes.PV) return 'text-orange-500 '
    if (type === AnimeTypes.CM) return 'text-indigo-600 '
    if (type === AnimeTypes.MUSIC) return 'text-pink-500 '

    return 'text-Primary-50'
  },

  getTagColor(type: string): string {
    const TAG_COLORS: Record<string, string> = {
      Anime: 'bg-emerald-700 md:hover:bg-emerald-800 text-white',
      Special: 'bg-yellow-500 md:hover:bg-yellow-400 text-white',
      OVA: 'bg-green-500 md:hover:bg-green-400 text-white',
      ONA: 'bg-red-500 md:hover:bg-red-400 text-white',
      Movie: 'bg-purple-500 md:hover:bg-purple-400 text-white',
      Music: 'bg-pink-500 md:hover:bg-pink-400 text-white',
      Unknown: 'bg-gray-300 md:hover:bg-gray-400 text-gray-900',
      PV: 'bg-orange-500 md:hover:bg-orange-400 text-white',
      CM: 'bg-indigo-600 md:hover:bg-indigo-500 text-white',
    }

    return (
      TAG_COLORS[type] ?? 'text-white bg-enfasisColor md:hover:bg-enfasisColor'
    )
  },

  getMusicTypeColor(type: string): string {
    const lowerType = type?.toLowerCase()
    if (lowerType === 'opening' || lowerType === 'op') {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
    if (lowerType === 'ending' || lowerType === 'ed') {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
    if (lowerType === 'insert') {
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  },
}
