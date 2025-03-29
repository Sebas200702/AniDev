import { Filters } from 'types'

export const getFilters = (filtersEnum: typeof Filters, url: URL) => {
  return Object.values(filtersEnum).reduce(
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
      } else {
        filters[filter] = value ? value.split('_') : null
      }

      return filters
    },
    {} as Record<string, string | number | boolean | string[] | null>
  )
}
