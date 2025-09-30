import { AnimeCharacterLoader } from '@anime/components/anime-charcaters/anime-character-loader'
import { AnimeCharacterList } from '@anime/components/anime-charcaters/anime-chatcater-list'
import { useCharacterList } from '@anime/hooks/anime-charater/useCharacterList'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { languageOptions } from '@search/utils/constants'

interface Props {
  animeId: number
}

export const CharacterSection = ({ animeId }: Props) => {
  const { language, setLanguage, characters, isLoading } = useCharacterList({
    animeId,
  })

  return (
    <section className="relative z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lxx font-bold text-white">Characters</h2>
        <FilterDropdown
          label="Language"
          styles="max-w-44 mx-0"
          values={[language]}
          onChange={(values) => {
            if (values.length > 0) {
              setLanguage(values[0])
            } else {
              setLanguage('')
            }
          }}
          onClear={() => setLanguage('')}
          options={languageOptions}
          singleSelect={true}
        />
      </header>
      <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        {!characters || (isLoading && <AnimeCharacterLoader />)}

        {characters && !isLoading && (
          <AnimeCharacterList characters={characters} />
        )}
      </ul>
    </section>
  )
}
