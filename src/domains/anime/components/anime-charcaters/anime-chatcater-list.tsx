import { AnimeCharacterCard } from '@character/components/character-card/detail-character-card'
import type { Character } from '@character/types'

export const AnimeCharacterList = ({
  characters,
}: { characters: Character[] }) => {
  return (
    <>
      {characters.map((character) => (
        <AnimeCharacterCard
          character={character}
          key={character.character_id}
        />
      ))}
    </>
  )
}
