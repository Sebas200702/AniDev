import { useState, useEffect } from 'react'

interface Params {
  url: string
  options?: RequestInit
}
type Error = string | null

export const useFetch = <T>({ url, options }: Params) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error('Error fetching data')

        const json = await response.json().then((data) => data.anime)

        setData(json)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options])

  return { data, error, loading }
}
