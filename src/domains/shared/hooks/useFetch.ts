import { navigate } from 'astro:transitions/client'
import { type ApiResponse, api } from '@libs/api'
import { AppError } from '@shared/errors'
import { useCallback, useEffect, useState } from 'react'

interface UseFetchOptions<T> {
  url: string
  options?: RequestInit
  skip?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  navigate404?: boolean
  navigate403?: boolean
}

export function useFetch<T>({
  url,
  options,
  skip,
  onSuccess,
  onError,
  navigate404,
  navigate403,
}: UseFetchOptions<T>) {
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

      setStatus(res.status)
      setMeta(res.meta ?? null)
      setTotal(res.meta?.total_items ?? 0)

      if (res.status === 404 && navigate404) {
        navigate('/404')
        return
      }

      if (res.status === 403 && navigate403) {
        // Si hay un error de permisos, lo seteamos para que el componente pueda reaccionar
        // pero no navegamos automáticamente si queremos manejarlo en el componente (ej. modal)
        // Si navigate403 es true, podríamos navegar a una página de error, pero
        // generalmente el 403 se maneja con UI bloqueada.
        // Aquí asumimos que si se pide navegar, se va a home o login.
        // Pero para el caso de control parental, mejor devolvemos el error.
      }

      if (res.error) {
        const errorFactory =
          {
            400: AppError.validation,
            401: AppError.unauthorized,
            403: AppError.permission,
            404: AppError.notFound,
            429: AppError.tooManyRequests,
          }[res.status] || AppError.network

        const appError = errorFactory(res.error)

        setError(appError)
        setData(null)
        onError?.(appError)
      } else {
        setData(res.data)
        onSuccess?.(res.data as T)
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Unknown Error')
      setError(e)
      setData(null)
      if (status === null) setStatus(0)
      onError?.(e)
    } finally {
      setLoading(false)
    }
  }, [url, options, skip, navigate404, navigate403, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, status, error, loading, meta, total, refetch: fetchData }
}
