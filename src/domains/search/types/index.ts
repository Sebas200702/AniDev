export interface FilterOption {
  value: string
  label: string
}

export interface AppliedFilters {
  [category: string]: string[]
}

export enum SearchType {
  ANIMES = 'animes',
  MUSIC = 'music',
  CHARACTERS = 'characters',
}

export interface SearchHistory {
  query: string
  appliedFilters: AppliedFilters
  type: SearchType
  totalResults: number
}

export type SearchQueryOptions = {
  query: string
  filters?: AppliedFilters
  type?: SearchType
}

export type SearchResultData =
  | import('@anime/types').AnimeDetail[]
  | import('@music/types').AnimeSongWithImage[]
  | import('@character/types').Character[]
  | null

export interface SearchFilters {
  search_query?: string
  genre_filter?: string[]
  studio_filter?: string[]
  type_filter?: string[]
  status_filter?: string[]
  rating_filter?: string[]
  year_filter?: string[]
  season_filter?: string[]
  aired_day_filter?: string[]
  score_filter?: [number, number]
  parental_control?: boolean
  banners_filter?: boolean
  sort_column?: string
  sort_direction?: 'ASC' | 'DESC'
  limit_count?: number
  page_number?: number
}
