import { AnimeCharacterList } from '@anime/components/anime-charcaters/anime-characters-list'
import { useCharacterList } from '@anime/hooks/anime-charater/useCharacterList'

interface Props {
  animeId: number
}

export const CharacterSection = ({ animeId }: Props) => {
  const { language, setLanguage, characters, isLoading } = useCharacterList({
    animeId,
  })

  return (
    <AnimeCharacterList
      characters={characters}
      language={language}
      setLanguage={setLanguage}
      isLoading={isLoading}
    />
  )
}
