import { CharacterInfo } from '@character/components/character-details/character'
import { CharacterLoader } from '@character/components/character-details/character-loader'
import type { CharacterDetails } from '@character/types'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import type { PersonAbout } from '@user/types'
import { useEffect, useState } from 'react'

export const CharacterContainer = ({ slug }: { slug: string }) => {
  const { data: character, error } = useFetch<CharacterDetails>({
    url: `/characters/getCharacter?slug=${slug}`,
    navigate404: true,
  })
  const [about, setAbout] = useState<PersonAbout | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!character) return

    const fetchAbout = async () => {
      try {
        const response = await fetch(`/api/characters/about`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ about: character.character_about ?? '' }),
        })
        const { data } = await response.json()

        setAbout(data)
      } catch (error) {
        console.error('Failed to fetch about:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAbout()
  }, [character])

  return (
    <DataWrapper<CharacterDetails>
      data={character!}
      loading={isLoading}
      error={error}
      loadingFallback={<CharacterLoader />}
    >
      {(data) => <CharacterInfo character={data} about={about} />}
    </DataWrapper>
  )
}
