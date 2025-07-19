import { AnimeCharacterLoader } from '@components/anime-info/anime-character-loader'
import { AnimeCharacterCard } from '@components/characters/detail-character-card'
import { NexPrevBtnSlideList } from '@components/index/slider/next-prev-btn-slider-list'
import { useCharacterStore } from '@store/character-store'
import { useWindowWidth } from '@store/window-width'
import { useEffect, useRef } from 'react'
import type { Character } from 'types'

export const AnimeCaterList = ({
  animeId,
  language,
}: {
  animeId: number
  language: string
}) => {
  const listRef = useRef<HTMLUListElement>(null)

  const { setCharacters, setIsLoading, isLoading, characters } =
    useCharacterStore()

  const formatCharacters = (characters: Character[], language: string) => {
    const characterMap = new Map<string, Character>()
    characters.forEach((char) => {
      const existing = characterMap.get(char.character_id.toString())
      if (!existing) {
        characterMap.set(char.character_id.toString(), char)
      } else if (char.voice_actor_language === language) {
        characterMap.set(char.character_id.toString(), char)
      }
    })
    return Array.from(characterMap.values())
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchCharacters = async () => {
      const response = await fetch(
        `/api/getAnimeCharacters?animeId=${animeId}&language=${language}`
      )
      const data = await response.json()
      setCharacters(formatCharacters(data, language))
      setIsLoading(false)
    }
    fetchCharacters()
  }, [animeId, language])

  if (isLoading) return <AnimeCharacterLoader />

  return (
    <ul
      ref={listRef}
      className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2"
    >
      {characters.map((character) => (
        <AnimeCharacterCard
          character={character}
          key={character.character_id}
        />
      ))}
    </ul>
  )
}
