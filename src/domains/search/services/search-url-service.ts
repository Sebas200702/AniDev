import type { SearchType } from '@search/types'

interface BuildUrlParams {
  type: SearchType
  query: string
  filters: string | null
  parentalControl: boolean | null
}

/**
 * Search URL Service
 *
 * @description
 * Service layer for search URL operations. Handles business logic
 * for building search URLs with proper filters and query parameters.
 *
 * @features
 * - URL construction for different search types
 * - Default filters management
 * - Query parameter encoding
 */
export const SearchUrlService = {
  /**
   * Get default filters based on search type
   */
  getDefaultFilters(type: SearchType, parentalControl: boolean | null): string {
    const pathName = globalThis.location?.pathname || ''
    const isSearchPage = pathName.includes('/search')

    switch (type) {
      case 'animes': {
        const format = isSearchPage ? 'search' : 'anime-detail'
        return `limit_count=30&banners_filter=false&format=${format}&parental_control=${parentalControl}`
      }
      case 'music':
        return 'limit_count=30'
      case 'characters':
        return 'limit_count=30&language_filter=japanese'
      default:
        return 'limit_count=30'
    }
  },

  /**
   * Build complete search URL with all parameters
   */
  buildUrl({ type, query, filters, parentalControl }: BuildUrlParams): string {
    const defaultFilters = this.getDefaultFilters(type, parentalControl)
    const baseQuery = `/${type}?${defaultFilters}`

    const searchQuery = query
      ? `&search_query=${encodeURIComponent(query)}`
      : ''

    const filterQuery = filters ? `&${filters}` : ''

    return `${baseQuery}${searchQuery}${filterQuery}`
  },

  /**
   * Parse URL to extract search parameters
   */
  parseUrl(url: string): {
    type: SearchType | null
    query: string | null
    filters: Record<string, string>
  } {
    try {
      const urlObj = new URL(
        url,
        globalThis.location?.origin || 'http://localhost'
      )
      const params = new URLSearchParams(urlObj.search)

      const type = urlObj.pathname.replace('/', '') as SearchType
      const query = params.get('search_query')

      const filters: Record<string, string> = {}
      for (const [key, value] of params) {
        if (key !== 'search_query') {
          filters[key] = value
        }
      }

      return { type, query, filters }
    } catch (error) {
      console.error('[SearchUrlService.parseUrl] Error:', error)
      return { type: null, query: null, filters: {} }
    }
  },

  /**
   * Update URL parameter
   */
  updateUrlParam(url: string, key: string, value: string): string {
    try {
      const urlObj = new URL(
        url,
        globalThis.location?.origin || 'http://localhost'
      )
      urlObj.searchParams.set(key, value)
      return urlObj.pathname + urlObj.search
    } catch (error) {
      console.error('[SearchUrlService.updateUrlParam] Error:', error)
      return url
    }
  },

  /**
   * Remove URL parameter
   */
  removeUrlParam(url: string, key: string): string {
    try {
      const urlObj = new URL(
        url,
        globalThis.location?.origin || 'http://localhost'
      )
      urlObj.searchParams.delete(key)
      return urlObj.pathname + urlObj.search
    } catch (error) {
      console.error('[SearchUrlService.removeUrlParam] Error:', error)
      return url
    }
  },
}
