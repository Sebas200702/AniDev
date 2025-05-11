import { Filters } from 'types'

/**
 * Processes URL search parameters to extract and format filter values.
 *
 * @description This utility function processes URL search parameters to create a structured
 * filter object for database queries. It handles different types of filters including:
 * - Boolean filters (parental control, banners)
 * - Numeric filters (page number, limit count)
 * - Text filters (search query)
 * - Array filters (other filter types)
 *
 * The function normalizes filter values to their appropriate types and provides
 * null values for missing parameters. This ensures consistent data types for
 * database queries and API responses.
 *
 * @param {typeof Filters} filtersEnum - The Filters enum containing all possible filter keys
 * @param {URL} url - The URL object containing search parameters
 * @returns {Record<string, string | number | boolean | string[] | null>} An object containing processed filter values
 *
 * @example
 * const url = new URL('https://example.com?parental_control=true&page_number=1&genre_filter=action_romance');
 * const filters = getFilters(Filters, url);
 * // Returns: {
 * //   parental_control: true,
 * //   page_number: "1",
 * //   genre_filter: ["action", "romance"],
 * //   // ... other filters
 * // }
 */
export const getFilters = (filters: string[], url: URL) => {
  return filters.reduce(
    (filters, filter) => {
      const value = url.searchParams.get(filter)
      if (
        filter === Filters.parental_control ||
        filter === Filters.banners_filter
      ) {
        filters[filter] = value === 'true' ? true : false
      } else if (
        filter === Filters.page_number ||
        filter === Filters.limit_count ||
        filter === Filters.search_query
      ) {
        filters[filter] = value ?? null
      } else if (filter === Filters.order_by) {
        if (value) {
          const [column, direction] = value.split(' ')
          filters['sort_column'] = column
          filters['sort_direction'] = direction || 'desc'
        }
      } else if (filter === Filters.aired_day_filter) {
        if (value) {
          filters[filter] = value.split('_')
        }
      } else {
        filters[filter] = value ? value.split('_') : null
      }

      return filters
    },
    {} as Record<string, string | number | boolean | string[] | null>
  )
}
