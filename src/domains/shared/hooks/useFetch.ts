import { type ApiResponse, api } from '@libs/api'
import { useCallback, useEffect, useState } from 'react'

interface Params {
  url: string
  options?: RequestInit
  skip?: boolean
}

export function useFetch<T>({ url, options, skip }: Params) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [meta, setMeta] = useState<Record<string, any> | null>(null)
  const [total, setTotal] = useState<number>(0)

  const fetchData = useCallback(async () => {
    if (!url || skip) return
    setLoading(true)
    setError(null)

    try {
      const res: ApiResponse<T> = await api.get<T>(url, options)
      setData(res.data)
      setStatus(res.status)
      setMeta(res.meta ?? null)
      setTotal(res.meta?.total_items ?? 0)

      if (res.error) throw new Error(res.error.message || 'Unknown Error')
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Unknown Error')
      setError(e)
      setData(null)
      setStatus(null)
      setMeta(null)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [url, options, skip])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, status, error, loading, meta, total, refetch: fetchData }
}
