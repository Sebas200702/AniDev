export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://animeflix.vercel.app'
    : 'http://localhost:4321'

export const getAnimeType = (type?: string) => {
  if (!type) return 'Unknown'
  const typeNormalized = type.toLowerCase()
  enum AnimeType {
    CM = 'CM',
    MOVIE = 'Movie',
    MUSIC = 'Music',
    ONA = 'ONA',
    OVA = 'OVA',
    PV = 'PV',
    SPECIAL = 'Special',
    TV = 'TV',
    TV_SPECIAL = 'TV SPECIAL',
  }
  if (typeNormalized === AnimeType.TV.toLowerCase()) return 'Anime'
  if (typeNormalized === AnimeType.OVA.toLowerCase()) return 'OVA'
  if (typeNormalized === AnimeType.MOVIE.toLowerCase()) return 'Movie'
  if (typeNormalized === AnimeType.SPECIAL.toLowerCase()) return 'Special'
  if (typeNormalized === AnimeType.ONA.toLowerCase()) return 'ONA'
  if (typeNormalized === AnimeType.TV_SPECIAL.toLowerCase()) return 'Special'
  if (typeNormalized === AnimeType.MUSIC.toLowerCase()) return 'Music'
  if (typeNormalized === AnimeType.PV.toLowerCase()) return 'PV'
  if (typeNormalized === AnimeType.CM.toLowerCase()) return 'CM'
  return 'Unknown'
}
export const normalizeString = (str: string) => {
  return str.replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
}

export const createHrefToTag = (tag: string) => {
  return `/directory?tag=${tag}`
}

export const detectTypeOfFilterOfTag = (tag: string) => {
  enum AnimeGenres {
    ACTION = 'Action',
    ADVENTURE = 'Adventure',
    AVANT_GARDE = 'Avant Garde',
    AWARD_WINNING = 'Award Winning',
    BOYS_LOVE = 'Boys Love',
    COMEDY = 'Comedy',
    DRAMA = 'Drama',
    ECCHI = 'Ecchi',
    EROTICA = 'Erotica',
    FANTASY = 'Fantasy',
    GIRLS_LOVE = 'Girls Love',
    GOURMET = 'Gourmet',
    HENTAI = 'Hentai',
    HORROR = 'Horror',
    MYSTERY = 'Mystery',
    ROMANCE = 'Romance',
    SCI_FI = 'Sci-Fi',
    SLICE_OF_LIFE = 'Slice of Life',
    SPORTS = 'Sports',
    SUPERNATURAL = 'Supernatural',
    SUSPENSE = 'Suspense',
  }
}

export const getTagColor = (type: string) => {
  enum AnimeTags {
    'Anime' = 'bg-blue-500 hover:bg-blue-400 text-white',
    'Special' = 'bg-yellow-500 hover:bg-yellow-400 text-white',
    'OVA' = 'bg-green-500 hover:bg-green-400 text-white',
    'ONA' = 'bg-red-500 hover:bg-red-400 text-white',
    'Movie' = 'bg-purple-500 hover:bg-purple-400 text-white',
    'Music' = 'bg-pink-500 hover:bg-pink-400 text-white',
    'Unknown' = 'bg-gray-300 hover:bg-gray-400 text-gray-900',
    'PV' = 'bg-orange-500 hover:bg-orange-400 text-white',
    'CM' = 'bg-indigo-600 hover:bg-indigo-500 text-white',
  }

  const tagColor = AnimeTags[type as keyof typeof AnimeTags]

  return tagColor
}
