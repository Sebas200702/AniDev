import { AnimeCaterList } from '@anime/components/anime-charcaters/anime-chatcater-list'
import { useCharacterStore } from '@anime/stores/anime-character-store'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { languageOptions } from 'types'

interface Props {
  animeId: number
}

export const CharacterSection = ({ animeId }: Props) => {
  const {
    currentLanguage,
    setCurrentLanguage,
    setIsLoading,
    characters,
    isLoading,
  } = useCharacterStore()

  return (
    <section className="relative z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lxx font-bold text-white">Characters</h2>
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
        <div className="h-full w-full rounded-lg p-6 text-white">
          <p>Do not have characters for this anime on this language</p>
        </div>
      )}

      {currentLanguage ? (
        <AnimeCaterList animeId={animeId} language={currentLanguage} />
      ) : (
        <div className="rounded-lg bg-zinc-700 p-6 text-white">
          <p>Please select a language to see the characters.</p>
        </div>
      )}
    </section>
  )
}
