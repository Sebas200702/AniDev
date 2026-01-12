import { useEffect, useRef } from 'react'

import { toast } from '@pheralb/toast'
import { ErrorBoundary } from '@shared/components/error/error-boundary'
import { useBlockedContent } from '@shared/hooks/useBlockedContent'
import { ToastType } from '@shared/types'
import type { ReactNode } from 'react'

interface DataWrapperProps<T> {
  data?: T
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  loadingFallback?: ReactNode
  noDataFallback?: ReactNode
  children: (data: T) => ReactNode
  retryCount?: number
}

export function DataWrapper<T>({
  data,
  loading,
  error,
  onRetry,
  loadingFallback,
  noDataFallback,
  children,
  retryCount = 0,
}: Readonly<DataWrapperProps<T>>) {
  const lastErrorRef = useRef<string | null>(null)

  useBlockedContent({ error: error || null })

  useEffect(() => {
    // Skip toast for permission errors as they are handled by useBlockedContent modal
    if (error && (error as any).type === 'permission') return

    if (error && error.message !== lastErrorRef.current && retryCount === 0) {
      lastErrorRef.current = error.message

      toast[ToastType.Error]({
        text: error.message || 'Ocurrió un error inesperado',
        action: onRetry
          ? {
              content: 'Reintentar',
              onClick: () => onRetry(),
            }
          : undefined,
      })
    }
  }, [error, onRetry, retryCount])

  if (loading && !data) {
    return (
      <>
        {loadingFallback || (
          <div className="flex items-center justify-center p-6 text-gray-300">
            Cargando...
          </div>
        )}
      </>
    )
  }

  if (!data && !error) {
    return (
      <>
        {noDataFallback || (
          <div className="text-gray-400">Sin datos para mostrar.</div>
        )}
      </>
    )
  }

  return <ErrorBoundary>{data && children(data)}</ErrorBoundary>
}
