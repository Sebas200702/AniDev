/**
 * Throttle function: Limita la ejecución de una función a una vez cada `wait` ms
 * Útil para optimizar actualizaciones de alta frecuencia (ej: video time updates)
 *
 * @param func - Función a throttlear
 * @param wait - Milisegundos de espera entre ejecuciones
 * @returns Versión throttleada de la función
 *
 * @example
 * const throttledUpdate = throttle((value) => {
 *   setCurrentTime(value)
 * }, 200)
 *
 * // Se ejecutará máximo una vez cada 200ms
 * throttledUpdate(10)
 * throttledUpdate(20)
 * throttledUpdate(30)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func(...args)
    } else {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func(...args)
      }, remaining) ?? timeout
    }
  }
}
