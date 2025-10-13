import { AnimeCharacterList } from '@anime/components/anime-characters/anime-characters-list'
import { useCharacterList } from '@character/hooks/useCharacterList'

interface Props {
  animeId: number
}

export const CharacterSection = ({ animeId }: Props) => {
  const { language, setLanguage, characters, isLoading } = useCharacterList({
    animeId,
  })

  return (
    <AnimeCharacterList
      characters={characters!}
      language={language}
      setLanguage={setLanguage}
      isLoading={isLoading}
    />
  )
}
