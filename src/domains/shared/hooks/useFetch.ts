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
 * @description
 * This hook handles the complete data fetching lifecycle including loading states, error handling,
 * and successful data retrieval. It uses the Fetch API to make HTTP requests and automatically
 * parses JSON responses. The hook sets up an effect that triggers whenever the URL, options, or skip
 * parameter changes.
 *
 * The hook maintains three internal states:
 * - data: stores the successfully fetched and parsed response
 * - error: captures any errors that occur during the fetch operation
 * - loading: indicates whether a fetch operation is currently in progress
 *
 * When the skip parameter is true or no URL is provided, the fetch operation is bypassed entirely.
 * This allows for conditional fetching based on application state. The hook also handles HTTP error
 * responses by checking the 'ok' property of the Response object.
 *
 * @param {Object} params - The parameters for the fetch operation.
 * @param {string} params.url - The URL to fetch data from.
 * @param {RequestInit} [params.options] - Optional fetch options.
 * @param {boolean} [params.skip] - If true, the fetch operation will be skipped.
 * @returns {{ data: T | null, error: string | null, loading: boolean }} - The fetched data, error message, and loading state.
 *
 * @example
 * const { data, error, loading } = useFetch<AnimeData>({
 *   url: 'https://api.example.com/anime/123',
 *   options: { headers: { 'Authorization': 'Bearer token' } }
 * });
 */
export const useFetch = <T>({ url, options, skip }: Params) => {
  const [data, setData] = useState<T | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<number | null>(null)

  useEffect(() => {
    if (!url || skip) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, options)

        setStatus(response.status)

        if (!response.ok) {
          const errorMessage = `Error fetching data: ${response.statusText}`
          throw new Error(errorMessage)
        }

        const responseData = await response.json()
        const json: T = responseData.data
        const total = responseData.total_items

        setData(json)
        setTotal(total)
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

  return { data, total, error, loading, status }
}
