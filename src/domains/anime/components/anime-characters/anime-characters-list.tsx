import { AnimeCharacterLoader } from '@anime/components/anime-characters/anime-characters-loader'
import { AnimeCharacterCard } from '@character/components/character-card/detail-character-card'
import type { Character } from '@character/types'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { languageOptions } from '@search/utils/constants'
import { DataWrapper } from '@shared/components/error/data-wrapper'

interface Props {
  language: string
  setLanguage: (lang: string) => void
  characters: Character[]
  isLoading: boolean
  error?: Error | null
}

export const AnimeCharacterList = ({
  language,
  setLanguage,
  characters,
  isLoading,
  error,
}: Props) => {
  return (
    <section className="relative z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lxx font-bold text-white">Characters</h2>
        <FilterDropdown
          label="Language"
          styles="max-w-44 mx-0"
          values={[language]}
          onChange={(values) => setLanguage(values[0] ?? '')}
          onClear={() => setLanguage('')}
          options={languageOptions}
          singleSelect
        />
      </header>
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <DataWrapper<Character[]>
          data={characters}
          loading={isLoading}
          error={error}
          noDataFallback={
            <div className="p-6 text-center text-gray-400">
              No characters found
            </div>
          }
          loadingFallback={<AnimeCharacterLoader />}
        >
          {(characters) => (
            <>
              {characters.map((character) => (
                <AnimeCharacterCard
                  key={character.character_id}
                  character={character}
                />
              ))}
            </>
          )}
        </DataWrapper>
      </div>
    </section>
  )
}
