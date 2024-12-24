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

export const createImageUrlProxy = (
  imageUrl: string,
  width?: string,
  quality?: string,
  format?: string
) => {
  return !width || !quality || !format
    ? `/api/proxy?url=${imageUrl}`
    : `/api/proxy?url=${imageUrl}&w=${width}&q=${quality}&format=${format}`
}

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const createDynamicBannersUrl = (): string => {
  const filters = Object.values(AnimeFilters) // Usamos los valores de la enum AnimeFilters.
  const types = Object.values(AnimeTypes)
  const genres = Object.values(AnimeGenres)

  const getRandomFilters = (count: number): AnimeFilters[] => {
    const selectedFilters = new Set<AnimeFilters>()
    while (selectedFilters.size < count) {
      const randomFilter = filters[
        getRandomNumber(0, filters.length - 1)
      ] as AnimeFilters
      if (
        randomFilter === AnimeFilters.Status ||
        randomFilter === AnimeFilters.Year ||
        randomFilter === AnimeFilters.Type ||
        randomFilter === AnimeFilters.Genre
      ) {
        selectedFilters.add(randomFilter)
      }
    }
    return Array.from(selectedFilters)
  }

  const generateUrl = (appliedFilters: AnimeFilters[]): string => {
    const filterObjects: Record<string, string>[] = []

    appliedFilters.forEach((filter) => {
      switch (filter) {
        case AnimeFilters.Type: {
          const type = types[getRandomNumber(0, types.length - 1)]
          if (type === AnimeTypes.TV || type === AnimeTypes.MOVIE) {
            filterObjects.push({ type_filter: type })
          }
          break
        }
        case AnimeFilters.Genre: {
          const genre = genres[getRandomNumber(0, genres.length - 1)]
          filterObjects.push({ genre_filter: genre })
          break
        }
        case AnimeFilters.Year: {
          const year = getRandomNumber(1990, 2022).toString()
          filterObjects.push({ year_filter: year })
          break
        }
        case AnimeFilters.Status: {
          const status =
            getRandomNumber(0, 1) === 0 ? 'Currently Airing' : 'Finished Airing'
          filterObjects.push({ status_filter: status })
          break
        }
        default:
          console.warn(`Unhandled filter: ${filter}`)
      }
    })

    const queryParams = filterObjects
      .map((filter) =>
        Object.entries(filter)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      )
      .join('&')

    return `/api/animes?limit_count=10&${queryParams}`
  }

  const appliedFilters = getRandomFilters(getRandomNumber(1, 2))
  return generateUrl(appliedFilters)
}
