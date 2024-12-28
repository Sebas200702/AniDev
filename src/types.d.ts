export type Anime = {
  readonly mal_id: number
  readonly title: string
  readonly title_japanese: string
  readonly title_synonyms: string[]
  readonly type: string
  readonly source: string
  readonly episodes: number | null
  readonly status: string
  readonly aired_from: string
  readonly year: string
  readonly aired_to?: string | null
  readonly duration: string
  readonly rating: string
  readonly score: number
  readonly scored_by: number
  readonly synopsis: string
  readonly genres: string[]
  readonly studios: string[]
  readonly trailer_url: string
  readonly image_url: string
  readonly image_webp: string
  readonly image_small_jpg: string
  readonly image_small_webp: string
  readonly image_large_jpg: string
  readonly image_large_webp: string
  readonly banner_image: string
  readonly created_at: string
  readonly relevance_score: number
}

export type Animes = {
  animes: Anime[]
}

export interface FilterOption {
  value: string
  label: string
}
export interface AnimeEpisode {
  id: string
  anime_mal_id: number
  episode_id: number
  video_url: string
  image_url: string
  title?: string
  description?: string
  date?: string
  image_url?: string
}
export interface AppliedFilters {
  [category: string]: string[]
}

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

export const genreOptions: FilterOption[] = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'thriller', label: 'Thriller' },
]

export const yearOptions: FilterOption[] = Array.from(
  { length: 24 },
  (_, i) => {
    const year = 2024 - i
    return { value: year.toString(), label: year.toString() }
  }
)

export const statusOptions: FilterOption[] = [
  { value: 'Currently Airing', label: 'Airing' },
  { value: 'Finished Airing', label: 'Finished' },
]

export const formatOptions: FilterOption[] = [
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
]
