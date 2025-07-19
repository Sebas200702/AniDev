import type { CharacterDetails } from 'types'

interface Props {
  character: CharacterDetails
}

export const CharacterHeader = ({ character }: Props) => {
  return (
    <header className="character-header z-20 row-span-2 flex h-full w-full flex-col gap-4 md:col-span-2 xl:col-span-4">
      <h1 className="title text-white">{character.character_name}</h1>
      <h2 className="text-l text-Primary-200">
        {character.character_name_kanji}
      </h2>
      <h3>Nicknames</h3>
      <p className="text-m text-Primary-200 max-w-[80ch]">
        {character.character_nicknames?.join(', ')}
      </p>
      <p className="text-m text-Primary-200 max-w-[80ch]">
        {character.character_about}
      </p>
    </header>
  )
}
