import { navigate } from 'astro:transitions/client'
import { useCallback } from 'react'

export const useSearchInput = (
  query: string,
  setQuery: (q: string) => void,
  setLoading: (loading: boolean) => void,
  isSearchPage: boolean,
  closeModal: () => void
) => {
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      setLoading(true)
    },
    [setQuery, setLoading]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!query.trim() || isSearchPage) return
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      closeModal()
    },
    [query, isSearchPage, closeModal]
  )

  return { handleInput, handleSubmit }
}
