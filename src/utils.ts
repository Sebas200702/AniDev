export enum AnimeTypes {
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
export enum AnimeGenres {
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

export enum AnimeFilters {
  Genre = 'genre',
  Type = 'type',
  Studio = 'studio',
  Score = 'score',
  Status = 'status',
  Year = 'year',
  Rating = 'rating',
}

export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://animeflix-rust.vercel.app'
    : 'http://localhost:4321'

export const reduceSynopsis = (synopsis?: string, size = 450) => {
  if (!synopsis) return 'No synopsis'
  return synopsis.slice(0, size) + '...'
}
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
export const normalizeString = (str: string) => {
  return str.replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '')
}

export const createHrefToTag = (tag: string) => {
  return `/directory?tag=${tag}`
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

  const tagColor =
    AnimeTags[type as keyof typeof AnimeTags] ||
    'bg-gray-300 hover:bg-gray-400 text-gray-900'

  return tagColor
}

export const createImageUrlProxy = (baseUrl: string, imageUrl: string) => {
  return `${baseUrl}/api/proxy-images?url=${imageUrl}`
}
