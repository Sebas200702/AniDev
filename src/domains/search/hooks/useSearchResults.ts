import type { AnimeDetail } from '@anime/types'
import type { Character } from '@character/types'
import type { AnimeSongWithImage } from '@music/types'
import { toast } from '@pheralb/toast'
import type { AppliedFilters, SearchHistory, SearchType } from '@search/types'
import { shouldSkipFetch } from '@search/utils/search-bar'
import { useFetch } from '@shared/hooks/useFetch'
import { ToastType } from '@shared/types'
import { useEffect } from 'react'

export const useSearchResults = (
  url: string,
  debouncedQuery: string,
  filtersToApply: string | null,
  query: string,
  appliedFilters: AppliedFilters,
  currentType: SearchType,
  setUrl: (url: string) => void,
  setResults: (data: any, loading: boolean, error: any) => void,
  setTotalResults: (total: number) => void,
  setLoading: (loading: boolean) => void,
  addSearchHistory: (entry: SearchHistory) => void
) => {
  const skipFetch = shouldSkipFetch(debouncedQuery, filtersToApply)

  const { data, loading, total, error } = useFetch<
    AnimeDetail[] | AnimeSongWithImage[] | Character[]
  >({
    url,
    skip: skipFetch,
  })

  useEffect(() => setUrl(url), [url, setUrl])

  useEffect(() => {
    if (!query) setLoading(false)
  }, [query, setLoading])

  useEffect(() => {
    if (
      data?.length === 0 &&
      (query || Object.keys(appliedFilters).length > 0) &&
      !loading
    ) {
      toast[ToastType.Warning]({
        text: `No results found for "${query}" with the selected filters.`,
      })
    }
  }, [data, appliedFilters, loading, query])

  useEffect(() => {
    setLoading(loading)
    if (
      loading ||
      (!query && Object.keys(appliedFilters).length === 0) ||
      !data
    )
      return

    setResults(data, false, error)
    setTotalResults(total)
    addSearchHistory({
      query,
      appliedFilters,
      totalResults: total,
      type: currentType,
    })
  }, [
    data,
    loading,
    error,
    setResults,
    setLoading,
    setTotalResults,
    addSearchHistory,
    query,
    appliedFilters,
    total,
  ])

  return { data, loading, error, total }
}
