import type { CharacterDetails, PersonAbout } from 'types'

interface Props {
  character: CharacterDetails

}

export const CharacterHeader = ({ character }: Props) => {

  const nicknames = character.character_nicknames ?? []

  return (
    <header className="character-header z-20 px-4 flex w-full flex-col items-center md:items-start rounded-2xl col-span-1 md:col-span-2 xl:col-span-4">

      <h1 className="title font-bold">
        {character.character_name} - {character?.character_name_kanji}
      </h1>

      {nicknames.length > 0 && (
        <p className="mt-2 text-l text-Primary-200">
          <span className="font-semibol text-Primary-50">Nicknames:</span>{'  '}
          {nicknames.join(', ')}
        </p>
      )}

    </header>
  )
}
