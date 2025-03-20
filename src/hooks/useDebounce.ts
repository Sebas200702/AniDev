import { useEffect, useState } from 'react'

/**
 * useDebounce is a custom hook that debounces a value for a specified delay.
 *
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds to wait before updating the debounced value.
 * @returns {T} The debounced value.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
