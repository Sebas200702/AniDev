export type Anime = {
  readonly mal_id: number
  readonly url: string | null
  readonly image_url: string | null
  readonly image_small_jpg: string | null
  readonly image_large_jpg: string | null
  readonly image_webp: string | null
  readonly image_small_webp: string | null
  readonly image_large_webp: string | null
  readonly youtube_id: string | null
  readonly trailer_url: string | null
  readonly trailer_embed_url: string | null
  readonly trailer_image_url: string | null
  readonly approved: boolean | null
  readonly title: string
  readonly title_english: string | null
  readonly title_japanese: string | null
  readonly type: string | null
  readonly source: string | null
  readonly episodes: number | null
  readonly status: string
  readonly airing: boolean | null
  readonly aired_from: string | null
  readonly aired_to: string | null
  readonly duration: string | null
  readonly rating: string | null
  readonly score: number | null
  readonly scored_by: number | null
  readonly popularity: number | null
  readonly members: number | null
  readonly favorites: number | null
  readonly synopsis: string | null
  readonly background: string | null
  readonly season: string | null
  readonly year: number
  readonly broadcast_day: string | null
  readonly broadcast_time: string | null
  readonly broadcast_timezone: string | null
  readonly title_synonyms: string[] | null
  readonly banner_image: string | null
  readonly genres: string[]
  readonly studios: string[]
  readonly producers: string[]
  readonly licensors: string[]
  readonly themes: string[]
}

export interface WatchList extends AnimeCardInfo {
  id: string
  user_id: string
  anime_id: string
  type: string
}
export enum CharacterFilters {
  limit_count = 'limit_count',
  role_filter = 'role_filter',
  search_query = 'search_query',
  order_by = 'order_by',
  page_number = 'page_number',
  language_filter = 'language_filter',
}

export interface Character {
  mal_id: number
  character_id: number
  character_name: string
  character_name_kanji: string
  character_nicknames: string[]
  character_about: string
  character_image_url: string
  character_small_image_url: string
  character_url: string
  role: string
  voice_actor_id: number
  voice_actor_name: string
  voice_actor_alternative_names: string[]
  voice_actor_family_name: string
  voice_actor_given_name: string
  voice_actor_birthday: string
  voice_actor_about: string
  voice_actor_image_url: string
  voice_actor_language: string
}

export interface Collection {
  title: string
  query: string
  animes_ids: number[]
}

export interface AnimeSongWithImage extends AnimeSong {
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
}
export interface AnimeSong {
  anime_id: number
  song_title: string
  type: string
  video_url: string
  audio_url: string
  version: number
  resolution: string
  song_id: number
  artist_name: string | null
  episodes: string | null
  sequence: number | null
  theme_id: number | null
  version_id: number | null
}
export interface RecommendationContext {
  type:
    | 'general'
    | 'current_search'
    | 'currently_watching'
    | 'mood_based'
    | 'similar_to'
    | 'seasonal'
    | 'marathon'
    | 'quick_watch'
  data?: {
    searchQuery?: string
    currentAnime?: string
    mood?: string
    referenceAnime?: string
    season?: string
    timeAvailable?: string
    preferredLength?: string
  }
  count?: number
  focus?: string
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
export enum MusicFilters {
  limit_count = 'limit_count',
  type_music = 'type_music',
  search_query = 'search_query',
  order_by = 'order_by',
  page_number = 'page_number',
}

export enum SearchType {
  ANIMES = 'animes',
  MUSIC = 'music',
  CHARACTERS = 'characters',
}

export type Animes = {
  animes: Anime[]
}
export interface ImageType {
  src: string
  alt: string
  maxWidth?: string
}
export interface AnimeCardInfo
  extends Pick<
    Anime,
    | 'mal_id'
    | 'title'
    | 'image_webp'
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

export interface CharacterDetails {
  character_id: number
  character_name: string
  character_name_kanji: string | null
  character_nicknames: string[] | null
  character_about: string | null
  character_image_url: string | null
  character_small_image_url: string | null
  character_url: string | null
  animes: AnimeSummary[]
  voice_actors: VoiceActor[]
}

export interface AnimeSummary extends AnimeCardInfo {
  banner_image: string | null
  role: string
}

export interface VoiceActor {
  id: string
  voice_actor_id: number
  name: string
  alternative_names: string[] | null
  family_name: string | null
  given_name: string | null
  birthday: string | null
  image_url: string | null
  language: string
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
  YURI = 'Yuri',
}

export enum AnimeFilters {
  Genre = 'genre_filter',
  Type = 'type_filter',
  Studio = 'studio_filter',
  Score = 'score_filter',
  Status = 'status_filter',
  Year = 'year_filter',
  Rating = 'rating_filter',
  SearcType = 'type',
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
export const typeMusic: FilterOption[] = [
  { value: 'OP', label: 'Opening' },
  { value: 'ED', label: 'Ending' },
]
export const ratingOptions: FilterOption[] = [
  { value: AnimeRating.G, label: 'Everyone' },
  { value: AnimeRating.PG, label: 'Kids' },
  { value: AnimeRating.PG_13, label: 'Teens' },
  { value: AnimeRating.R, label: 'Adults' },
  { value: AnimeRating.RN, label: 'Mild Nudity' },
  { value: AnimeRating.RX, label: 'Hentai' },
]
export const typeSearchOptions: FilterOption[] = [
  { value: 'animes', label: 'Anime' },
  { value: 'music', label: 'Music' },
  { value: 'characters', label: 'Characters' },
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
export const languageOptions: FilterOption[] = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Hebrew', label: 'Hebrew' },
  { value: 'Hungarian', label: 'Hungarian' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Portuguese (BR)', label: 'Portuguese (BR)' },
  { value: 'Spanish', label: 'Spanish' },
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
  { keys: ['ctrl', 'k', 'a'], action: 'open-anime-search' },
  { keys: ['ctrl', 'k', 'm'], action: 'open-music-search' },
]
