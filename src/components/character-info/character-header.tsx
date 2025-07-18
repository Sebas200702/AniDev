import type { CharacterDetails } from 'types'

interface Props {
  character: CharacterDetails
}

export const CharacterHeader = ({ character }: Props) => {
  return (
    <header className="character-header row-span-2 z-20 flex h-full w-full flex-col gap-4 md:col-span-2 xl:col-span-4">
      <h1 className="title text-white">{character.character_name}</h1>
      <h2 className="text-l text-Primary-200">{character.character_name_kanji}</h2>
      <h3>Nicknames</h3>
      <p className="text-m max-w-[80ch] text-Primary-200">{character.character_nicknames?.join(', ')}</p>
      <p className="text-m max-w-[80ch] text-Primary-200">{character.character_about}</p>
    </header>
  )
}
