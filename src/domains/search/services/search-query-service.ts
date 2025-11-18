import type { AppliedFilters } from '@search/types'

interface BuildQueryParams {
  query: string
  filters: AppliedFilters
}

/**
 * Search Query Service
 *
 * @description
 * Service layer for search query operations. Handles business logic
 * for query validation, formatting, and filter management.
 *
 * @features
 * - Query validation
 * - Filter-to-query string conversion
 * - Search state validation
 */
export const SearchQueryService = {
  /**
   * Check if there's an active search (query or filters)
   */
  hasActiveSearch({ query, filters }: BuildQueryParams): boolean {
    return query.trim().length > 0 || Object.keys(filters).length > 0
  },

  /**
   * Check if search should be skipped (no query and no filters)
   */
  shouldSkipSearch(
    debouncedQuery: string,
    filtersToApply: string | null
  ): boolean {
    return !(Boolean(debouncedQuery) || Boolean(filtersToApply))
  },

  /**
   * Sanitize search query
   */
  sanitizeQuery(query: string): string {
    return query.trim()
  },

  /**
   * Encode query for URL
   */
  encodeQuery(query: string): string {
    return encodeURIComponent(this.sanitizeQuery(query))
  },

  /**
   * Build search query string from filters
   */
  buildFilterString(filters: AppliedFilters): string {
    const params = new URLSearchParams()

    for (const [key, values] of Object.entries(filters)) {
      if (Array.isArray(values) && values.length > 0) {
        params.append(key, values.join(','))
      } else if (values) {
        params.append(key, String(values))
      }
    }

    return params.toString()
  },

  /**
   * Validate search input
   */
  validateSearch({ query, filters }: BuildQueryParams): {
    isValid: boolean
    error?: string
  } {
    const sanitizedQuery = this.sanitizeQuery(query)

    if (!sanitizedQuery && Object.keys(filters).length === 0) {
      return {
        isValid: false,
        error: 'Search requires either a query or filters',
      }
    }

    if (sanitizedQuery.length > 200) {
      return {
        isValid: false,
        error: 'Query is too long (max 200 characters)',
      }
    }

    return { isValid: true }
  },
}
