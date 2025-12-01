import { MusicFilters } from '@music/types'
import { Filters } from '@shared/types'
import { normalizeString } from '@utils/normalize-string'

export type FiltersResult = {
  sort_column?: string
  sort_direction?: string
  [key: string]: unknown
}

const parseBoolean = (_filter: string, raw: string | null): boolean =>
  raw === 'true'
const parseNumber = (raw: string | null): number | null =>
  raw ? Number(raw) : null
const parseText = (raw: string | null): string | null => raw ?? null
const parseArray = (raw: string | null): string[] | null =>
  raw ? raw.split('_').map((v) => normalizeString(v, false, false, true)) : null

function parseOrderBy(
  filter: string,
  raw: string | null,
  includeSortParams: boolean,
  out: FiltersResult
): void {
  if (!includeSortParams || !raw) return
  const [column = '', direction = ''] = raw.split(' ')
  out.sort_column =
    column || (filter === MusicFilters.order_by ? 'theme_id' : 'score')
  out.sort_direction = (direction || 'desc') as FiltersResult['sort_direction']
}

function processFilter(
  filter: string,
  raw: string | null,
  includeSortParams: boolean,
  out: FiltersResult
): void {
  if (
    filter === Filters.parental_control ||
    filter === Filters.banners_filter
  ) {
    out[filter] = parseBoolean(filter, raw)
    return
  }

  if (filter === Filters.page_number || filter === Filters.limit_count) {
    out[filter] = parseNumber(raw)
    return
  }

  if (filter === MusicFilters.anime_id) {
    out[filter] = parseNumber(raw)
    return
  }

  if (filter === Filters.search_query) {
    out[filter] = parseText(raw)
    return
  }

  if (filter === Filters.order_by || filter === MusicFilters.order_by) {
    parseOrderBy(filter, raw, includeSortParams, out)
    return
  }

  // default: treat as array-like filter (underscore-separated)
  out[filter] = parseArray(raw)
}

export const getFilters = (
  filters: string[],
  url: URL,
  includeSortParams: boolean = true
): FiltersResult => {
  const result: FiltersResult = {}

  for (const filter of filters) {
    const raw = url.searchParams.get(filter)
    processFilter(filter, raw, includeSortParams, result)
  }

  if (includeSortParams) {
    if (!result.sort_column) {
      const isMusic = filters.some(
        (f) => f === MusicFilters.type_music || f === MusicFilters.artist_filter
      )
      result.sort_column = isMusic ? 'theme_id' : 'score'
    }

    if (!result.sort_direction) result.sort_direction = 'desc'
  }

  return result
}
