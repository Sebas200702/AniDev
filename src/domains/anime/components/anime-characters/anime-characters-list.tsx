import { AnimeCharacterLoader } from '@anime/components/anime-characters/anime-characters-loader'
import { AnimeCharacterCard } from '@character/components/character-card/detail-character-card'
import type { Character } from '@character/types'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { languageOptions } from '@search/utils/constants'

interface Props {
  characters: Character[] | null
  language: string
  setLanguage: (language: string) => void
  isLoading?: boolean
}

const Container = ({
  children,
  actions,
}: {
  children: React.ReactNode
  actions?: React.ReactNode
}) => (
  <section className="relative z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
    <header className="flex items-center justify-between">
      <h2 className="text-lxx font-bold text-white">Characters</h2>
      {actions}
    </header>
    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
      {children}
    </div>
  </section>
)

export const AnimeCharacterList = ({
  characters,
  language,
  setLanguage,
  isLoading,
}: Props) => {
  const filter = (
    <FilterDropdown
      label="Language"
      styles="max-w-44 mx-0"
      values={[language]}
      onChange={(values) => setLanguage(values[0] ?? '')}
      onClear={() => setLanguage('')}
      options={languageOptions}
      singleSelect
    />
  )

  if (characters?.length === 0) {
    return (
      <Container actions={filter}>
        <p className="text-md text-center font-medium text-white">
          No characters found.
        </p>
      </Container>
    )
  }

  if (isLoading || !characters) {
    return (
      <Container actions={filter}>
        <AnimeCharacterLoader />
      </Container>
    )
  }

  return (
    <Container actions={filter}>
      {characters.map((character) => (
        <AnimeCharacterCard
          character={character}
          key={character.character_id}
        />
      ))}
    </Container>
  )
}
