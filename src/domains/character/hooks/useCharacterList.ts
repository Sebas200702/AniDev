import type { Character } from '@character/types'
import { useFetch } from '@shared/hooks/useFetch'
import { useState } from 'react'

export const useCharacterList = ({ animeId }: { animeId: number }) => {
  const [language, setLanguage] = useState('Japanese')
  const { data, loading, error } = useFetch<Character[]>({
    url: `/api/getAnimeCharacters?animeId=${animeId}&language=${language}`,
  })

  return {
    language,
    setLanguage,
    characters: data,
    isLoading: loading,
    error,
  }
}
