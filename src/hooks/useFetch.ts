import { useEffect, useState } from 'react'

interface Params {
  url: string
  options?: RequestInit
  skip?: boolean
}

type Error = string | null

/**
 * useFetch is a custom hook that fetches data from a given URL and manages loading and error states.
 *
 * @param {Object} params - The parameters for the fetch operation.
 * @param {string} params.url - The URL to fetch data from.
 * @param {RequestInit} [params.options] - Optional fetch options.
 * @param {boolean} [params.skip] - If true, the fetch operation will be skipped.
 * @returns {{ data: T | null, error: string | null, loading: boolean }} - The fetched data, error message, and loading state.
 */
export const useFetch = <T>({ url, options, skip }: Params) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!url || skip) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          const errorMessage = `Error fetching data: ${response.statusText}`
          throw new Error(errorMessage)
        }

        const json: T = await response.json().then((data) => data.data)
        setData(json)
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options, skip])

  return { data, error, loading }
}
