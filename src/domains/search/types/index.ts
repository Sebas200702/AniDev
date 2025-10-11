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
