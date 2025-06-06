import { AnimeCaterList } from '@components/anime-info/anime-chatcater-list'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { useCharacterStore } from '@store/character-store'
import { useState } from 'react'
import { languageOptions } from 'types'

interface Props {
  animeId: number
}

export const CharacterSection = ({ animeId }: Props) => {
  const { currentLanguage, setCurrentLanguage, setIsLoading, characters  , isLoading } =
    useCharacterStore()

  return (
    <section className="z-10 bg-Complementary relative p-4 rounded-lg flex flex-col gap-4">
      <header className="flex items-center justify-between px-10">
        <h2 className="text-2xl font-bold text-white">Characters</h2>
        <FilterDropdown
          label="Language"
          styles="max-w-44 mx-0"
          values={[currentLanguage]}
          onChange={(values) => {
            setIsLoading(true)
            if (values.length > 0) {
              setCurrentLanguage(values[0])
            } else {
              setCurrentLanguage('')
            }
          }}
          onClear={() => setCurrentLanguage('')}
          options={languageOptions}
          singleSelect={true}
        />
      </header>
      {characters.length === 0 && currentLanguage && !isLoading && (
        <div className="p-6 bg-zinc-700 text-white rounded-lg">
          <p>Do not have characters for this anime on this language</p>
        </div>
      )}

      {currentLanguage ? (
        <AnimeCaterList animeId={animeId} language={currentLanguage} />
      ) : (
        <div className="p-6 bg-zinc-700 text-white rounded-lg">
          <p>Please select a language to see the characters.</p>
        </div>
      )}
    </section>
  )
}
