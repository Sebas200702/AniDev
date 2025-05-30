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
}
export interface ApiJsonResponse {
  url?: string
  message?: string
  [key: string]: unknown
}

declare module '@auth-astro/client' {
  interface AstroSignInOptions {
    callbackUrl?: string
  }
}
export enum OrderFunctions {
  score = 'get_animes_order_by_score',
  score_asc = 'get_animes_order_by_score_asc',
  title = 'get_animes_order_by_title',
  title_asc = 'get_animes_order_by_title_asc',
}
export enum Filters {
  limit_count = 'limit_count',
  page_number = 'page_number',
  genre_filter = 'genre_filter',
  type_filter = 'type_filter',
  studio_filter = 'studio_filter',
  score_filter = 'score_filter',
  status_filter = 'status_filter',
  search_query = 'search_query',
  parental_control = 'parental_control',
  year_filter = 'year_filter',
  rating_filter = 'rating_filter',
  banners_filter = 'banners_filter',
  season_filter = 'season_filter',
  aired_day_filter = 'aired_day_filter',
  order_by = 'order_by',
}

export type Animes = {
  animes: Anime[]
}

export interface AnimeCardInfo
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
    | 'mal_id'
    | 'year'
    | 'status'
    | 'genres'
    | 'image_small_webp'
    | 'image_large_webp'
  > {}
export interface AnimeBannerInfo
  extends Pick<Anime, 'mal_id' | 'title' | 'synopsis' | 'banner_image'> {}

export interface AnimeCollectionInfo
  extends Pick<Anime, 'mal_id' | 'title' | 'image_webp' | 'image_small_webp'> {}
export interface AnimeDetail
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
    | 'image_small_webp'
    | 'image_large_webp'
    | 'banner_image'
    | 'year'
    | 'type'
    | 'episodes'
  > {}
export interface AnimeTopInfo
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
    | 'image_small_webp'
    | 'score'
    | 'genres'
    | 'season'
    | 'type'
    | 'episodes'
  > {}

export interface RandomAnime extends Pick<Anime, 'mal_id' | 'title'> {}
export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Loading = 'loading',
}
interface Collection {
  title: string
  query: string
  animes_ids: number[]
}
export interface IconProps {
  className?: string
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
export interface SearchHistory {
  query: string
  appliedFilters: AppliedFilters
  results: AnimeCardInfo[]
  totalResults: number
}
export interface UserInfo {
  name: string | null
  avatar: string | null
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
  TV_SPECIAL = 'TV Special',
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
export enum AnimeRating {
  G = 'g - all ages',
  PG = 'pg - children',
  PG_13 = 'pg-13 - teens 13 or older',
  R = 'r - 17+ (violence & profanity)',
  RN = 'r+ - mild nudity',
  RX = 'rx+-+hentai',
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
  { value: AnimeRating.G, label: 'Everyone' },
  { value: AnimeRating.PG, label: 'Kids' },
  { value: AnimeRating.PG_13, label: 'Teens' },
  { value: AnimeRating.R, label: 'Adults' },
  { value: AnimeRating.RN, label: 'Mild Nudity' },
  { value: AnimeRating.RX, label: 'Hentai' },
]
export const airedDayOptions: FilterOption[] = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
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
]
export interface Section {
  label: string
  icon?: React.FC<{ className?: string }>
  selected: boolean
}

export interface Session {
  name: string | null
  avatar: string | null
}
export type HTMLInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
declare namespace JSX {
  interface IntrinsicElements {
    'lite-youtube': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        videoid: string
        params?: string
      },
      HTMLElement
    >
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lite-youtube': HTMLElement
  }
}

export const shortCuts = [
  { keys: ['ctrl', 'k'], action: 'open-search' },
  { keys: ['ctrl', 'shift', 'k'], action: 'close-search' },
  { keys: ['ctrl', 's'], action: 'navigate-settings' },
  { keys: ['ctrl', 'h'], action: 'navigate-home' },
  { keys: ['ctrl', 'p'], action: 'navigate-profile' },
  { keys: ['ctrl', 'r'], action: 'random-anime' },
  { keys: ['ctrl', 'shift', 'h'], action: 'open-search-history' },
  { keys: ['ctrl', 'shift', 'c'], action: 'clear-search-history' },
]
