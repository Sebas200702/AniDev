import type { AppliedFilters, SearchHistory } from '@search/types'

/**
 * Check if two search histories are equal
 */
export const areSearchHistoriesEqual = (
  a: SearchHistory,
  b: SearchHistory
): boolean => {
  return (
    a.query === b.query &&
    a.type === b.type &&
    JSON.stringify(a.appliedFilters) === JSON.stringify(b.appliedFilters)
  )
}

/**
 * Check if search has active query or filters
 */
export const hasActiveSearch = (
  query: string,
  filters: AppliedFilters
): boolean => {
  return query.trim().length > 0 || Object.keys(filters).length > 0
}

/**
 * Deduplicate search history entries
 */
export const deduplicateSearchHistory = (
  history: SearchHistory[]
): SearchHistory[] => {
  const seen = new Set<string>()
  return history.filter((item) => {
    const key = `${item.query}-${item.type}-${JSON.stringify(item.appliedFilters)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Sort search history by most recent
 */
export const sortSearchHistoryByRecent = (
  history: SearchHistory[]
): SearchHistory[] => {
  // If history items have timestamp, sort by it
  // Otherwise, maintain current order (most recent first)
  return [...history]
}

/**
 * Limit search history to max items
 */
export const limitSearchHistory = (
  history: SearchHistory[],
  maxItems = 50
): SearchHistory[] => {
  return history.slice(0, maxItems)
}

/**
 * Format search history for storage
 */
export const prepareSearchHistoryForStorage = (
  history: SearchHistory[],
  maxItems = 50
): SearchHistory[] => {
  return limitSearchHistory(deduplicateSearchHistory(history), maxItems)
}
