export interface IconProps {
  className?: string
}

export interface Section {
  label: string
  icon?: React.FC<{ className?: string }>
  selected: boolean
}

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Loading = 'loading',
}
export interface MetadataResult {
  title: string
  description: string
  image: string
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

export enum InputType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  FILE = 'file',
  DATE = 'date',
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

export interface ApiJsonResponse {
  url?: string
  message?: string
  [key: string]: unknown
}

export type FallbackReason =
  | 'quota-exhausted'
  | 'api-error'
  | 'text-parsing'
  | 'jikan'
  | null

export interface ImageType {
  src: string
  alt: string
  maxWidth?: string
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
