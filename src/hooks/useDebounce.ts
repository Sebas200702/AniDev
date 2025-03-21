import { useEffect, useState } from 'react'

/**
 * useDebounce is a custom hook that debounces a value for a specified delay.
 *
 * @description
 * This hook creates a debounced version of a value that only updates after a specified delay
 * has passed without any new changes. It's useful for reducing the frequency of updates in
 * scenarios like search inputs, form validation, or any situation where you want to limit
 * the rate of execution of expensive operations.
 *
 * The hook maintains an internal state for the debounced value and sets up an effect that
 * updates this state after the specified delay. If the input value changes before the delay
 * expires, the previous timeout is cleared and a new one is started. This ensures that the
 * debounced value only updates after the input has been stable for the duration of the delay.
 *
 * @param {T} value - The value to debounce
 * @param {number} delay - The delay in milliseconds to wait before updating the debounced value
 * @returns {T} The debounced value that updates only after the specified delay
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
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
