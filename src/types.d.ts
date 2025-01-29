export type Anime = {
  readonly mal_id: number
  readonly title: string
  readonly title_japanese: string
  readonly title_synonyms: string[]
  readonly type: string
  readonly source: string
  readonly episodes: number
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
  readonly aired: boolean | null
  readonly themes: string[] | null
  readonly producers: string[] | null
  readonly season: string | null
  readonly aired_day: string | null
  readonly relevance_score: number
}

export type Animes = {
  animes: Anime[]
}

interface Collection {
  title: string
  query: string
  animes_ids: number[]
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
  Genre = 'genre_filter',
  Type = 'type_filter',
  Studio = 'studio_filter',
  Score = 'score_filter',
  Status = 'status_filter',
  Year = 'year_filter',
  Rating = 'rating_filter',
}

export const genreOptions: FilterOption[] = Object.values(AnimeGenres).map(
  (genre) => ({ value: genre.toLowerCase(), label: genre })
)

export const yearOptions: FilterOption[] = Array.from(
  { length: 71 },
  (_, i) => {
    const year = 2025 - i
    return { value: year.toString(), label: year.toString() }
  }
)
export const ratingOptions: FilterOption[] = [
  { value: 'g - all ages', label: 'Everyone' },
  { value: 'pg - children', label: 'Kids' },
  { value: 'pg-13 - teens 13 or older', label: 'Teens' },
  { value: 'r - 17+ (violence & profanity)', label: 'Adults' },
]

export const statusOptions: FilterOption[] = [
  { value: 'currently airing', label: 'Airing' },
  { value: 'finished airing', label: 'Finished' },
  { value: 'not yet aired', label: 'Not Yet Aired' },
]
export const seasonOptions: FilterOption[] = [
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
]

export const formatOptions: FilterOption[] = [
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
]

export const orderByOptions: FilterOption[] = [
  { value: 'score asc', label: 'Lowest score' },
  { value: 'score', label: 'Highest Score' },
  { value: 'title asc', label: 'A-Z' },
  { value: 'title', label: 'Z-A ' },
  { value: 'relevance_score asc', label: ' The Least Relevant' },
  { value: 'relevance_score', label: 'The Most Relevant' },
]
export interface Section  {
  label: string
  icon: React.FC<{ className?: string }>
  selected: boolean
}
