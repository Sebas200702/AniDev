import { AnimeCaterList } from '@components/anime-info/anime-chatcater-list'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { useCharacterStore } from '@store/character-store'
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
    <section className="bg-Complementary relative z-10 flex flex-col gap-4 rounded-lg p-4">
      <header className="flex items-center justify-between md:px-10 px-2">
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
        <div className="rounded-lg bg-zinc-700 p-6 text-white">
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
