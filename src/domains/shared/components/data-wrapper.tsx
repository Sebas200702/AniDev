import { ErrorBoundary } from '@shared/components/error-boundary'
import { ErrorFallback } from '@shared/components/error-fallback'
import type { ReactNode } from 'react'

interface DataWrapperProps<T> {
  data?: T
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  loadingFallback?: ReactNode
  noDataFallback?: ReactNode
  children: (data: T) => ReactNode
}

/**
 * DataWrapper
 *
 * Componente genérico para manejar estados de carga, error y datos vacíos.
 * Simplifica la lógica de renderizado condicional en componentes que consumen datos.
 *
 * @example
 * <DataWrapper
 *   data={users}
 *   loading={loading}
 *   error={error}
 *   onRetry={refetch}
 *   noDataFallback={<p>No users found.</p>}
 * >
 *   {(users) => users.map(u => <UserCard key={u.id} {...u} />)}
 * </DataWrapper>
 */
export function DataWrapper<T>({
  data,
  loading,
  error,
  onRetry,
  loadingFallback,
  noDataFallback,
  children,
}: Readonly<DataWrapperProps<T>>) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback error={error || undefined} resetError={onRetry} />
      }
    >
      {loading &&
        (loadingFallback || (
          <div className="flex items-center justify-center p-6 text-gray-300">
            Cargando...
          </div>
        ))}

      {!loading && error && (
        <ErrorFallback error={error} resetError={onRetry} />
      )}

      {!loading &&
        !error &&
        !data &&
        (noDataFallback || (
          <div className="text-gray-400">Sin datos para mostrar.</div>
        ))}

      {!loading && !error && data && <>{children(data)}</>}
    </ErrorBoundary>
  )
}
