import { createDynamicUrl } from '@anime/utils/create-dynamic-url'
import { api } from '@libs/api'
import { useFetch } from '@shared/hooks/useFetch'
import { useHomeCacheStore } from '@shared/stores/home-cache-store'
import type { CachedAnimeResponse } from '@shared/types/cache-types'
import { useCallback, useEffect, useState } from 'react'

interface Params {
  url: string
  options?: RequestInit
  skip?: boolean
  sectionId: string
  maxRetries?: number
  limit?: number
}

export const useFetchWithCache = <T>({
  url,
  options,
  skip,
  sectionId,
  maxRetries = 3,
  limit = 24,
}: Params) => {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [retryCount, setRetryCount] = useState(0)
  const [isCached, setIsCached] = useState(false)

  const { getCachedResponse, setCachedResponse, markAsError, shouldRetry } =
    useHomeCacheStore()
  const cached = getCachedResponse(sectionId, currentUrl)
  const shouldSkip =
    skip || (cached?.status === 'success' && cached.data.length > 0)

  const { data, status, error, loading, meta, total, refetch } = useFetch<T>({
    url: currentUrl,
    options,
    skip: shouldSkip,
  })

  const syncToRedis = useCallback(
    async (secUrl: string, secData: unknown) => {
      try {
        await api.post('/home/sync-cache', {
          sectionId,
          url: secUrl,
          data: secData,
        })
      } catch {
      }
    },
    [sectionId]
  )

  useEffect(() => {
    if (cached?.status === 'success' && cached.data.length > 0) {
      setIsCached(true)
    }
  }, [cached])

  useEffect(() => {
    if (data && !error) {
      const cachedResponse: CachedAnimeResponse = {
        url: currentUrl,
        data: Array.isArray(data) ? data : [],
        timestamp: Date.now(),
        status: 'success',
      }

      setCachedResponse(sectionId, cachedResponse)
      syncToRedis(currentUrl, data)
      setIsCached(false)
    }
  }, [data, error, currentUrl, sectionId, setCachedResponse, syncToRedis])


  useEffect(() => {
    if (error && !skip) {
      markAsError(sectionId, currentUrl, error.message)

      if (
        retryCount < maxRetries &&
        shouldRetry(sectionId, currentUrl, maxRetries)
      ) {
        const { url: newUrl } = createDynamicUrl(limit)
        setCurrentUrl(newUrl)
        setRetryCount(retryCount + 1)
      }
    }
  }, [
    error,
    skip,
    sectionId,
    currentUrl,
    retryCount,
    maxRetries,
    limit,
    markAsError,
    shouldRetry,
  ])

  const retry = useCallback(() => {
    setRetryCount(0)
    const { url: newUrl } = createDynamicUrl(limit)
    setCurrentUrl(newUrl)
  }, [limit])

  return {
    data: isCached && cached ? (cached.data as T) : data,
    status,
    error,
    loading: isCached ? false : loading,
    meta,
    total,
    refetch,
    retry,
    isCached,
    retryCount,
    maxRetries,
  }
}
