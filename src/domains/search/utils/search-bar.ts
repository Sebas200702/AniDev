import type { AnimeDetail } from '@anime/types'
import type { Character } from '@character/types'
import type { AnimeSongWithImage } from '@music/types'
import { SearchQueryService } from '@search/services/search-query-service'
import { SearchUrlService } from '@search/services/search-url-service'
import type { SearchResultData, SearchType } from '@search/types'

/**
 * Get default filters based on search type
 * @deprecated Use SearchUrlService.getDefaultFilters() instead
 */
export const getDefaultFilters = (
  type: SearchType,
  parentalControl: boolean | null
) => {
  return SearchUrlService.getDefaultFilters(type, parentalControl)
}

/**
 * Build search URL with all parameters
 * @deprecated Use SearchUrlService.buildUrl() instead
 */
export const buildSearchUrl = (
  type: SearchType,
  debouncedQuery: string,
  filtersToApply: string | null,
  parentalControl: boolean | null
) => {
  return SearchUrlService.buildUrl({
    type,
    query: debouncedQuery,
    filters: filtersToApply,
    parentalControl,
  })
}

/**
 * Check if search should be skipped
 * @deprecated Use SearchQueryService.shouldSkipSearch() instead
 */
export const shouldSkipFetch = (
  debouncedQuery: string,
  filtersToApply: string | null
) => {
  return SearchQueryService.shouldSkipSearch(debouncedQuery, filtersToApply)
}

export const isAnimeData = (data: SearchResultData): data is AnimeDetail[] => {
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
