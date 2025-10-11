import type { AnimeDetail } from '@anime/types'
import type { Character } from '@character/types'
import type { AnimeSongWithImage } from '@music/types'
import { SearchType } from '@search/types'

export const getDefaultFilters = (
  type: SearchType,
  parentalControl: boolean | null
) => {
  const pathName = window.location.pathname
  const isSearchPage = pathName.includes('/search')
  const defaultFiltersAnimes = isSearchPage
    ? `limit_count=30&banners_filter=false&format=search&parental_control=${parentalControl}`
    : `limit_count=30&banners_filter=false&format=anime-detail&parental_control=${parentalControl}`
  const defaultFiltersMusic = 'limit_count=30'
  const defaultFiltersCharacters = 'limit_count=30&language_filter=japanese'

  if (type === SearchType.ANIMES) return defaultFiltersAnimes
  if (type === SearchType.MUSIC) return defaultFiltersMusic
  return defaultFiltersCharacters
}

export const buildSearchUrl = (
  type: SearchType,
  debouncedQuery: string,
  filtersToApply: string | null,
  parentalControl: boolean | null
) => {
  const defaultFilters = getDefaultFilters(type, parentalControl)
  const baseQuery = `/api/${type}?${defaultFilters}`
  const searchQuery = debouncedQuery
    ? `&search_query=${encodeURIComponent(debouncedQuery)}`
    : ''
  const filterQuery = filtersToApply ? `&${filtersToApply}` : ''
  return `${baseQuery}${searchQuery}${filterQuery}`
}

export const shouldSkipFetch = (
  debouncedQuery: string,
  filtersToApply: string | null
) => {
  // Skip when there's nothing to search or filter
  return !(Boolean(debouncedQuery) || Boolean(filtersToApply))
}

export const isAnimeData = (
  data: AnimeDetail[] | AnimeSongWithImage[] | Character[] | null
): data is AnimeDetail[] => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    'mal_id' in data[0] &&
    'title' in data[0]
  )
}
export const isCharacterData = (
  data: AnimeDetail[] | AnimeSongWithImage[] | Character[] | null
): data is Character[] => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    'mal_id' in data[0] &&
    'character_name' in data[0]
  )
}
export const isMusicData = (
  data: AnimeDetail[] | AnimeSongWithImage[] | Character[] | null
): data is AnimeSongWithImage[] => {
  return Array.isArray(data) && data.length > 0 && 'song_id' in data[0]
}
