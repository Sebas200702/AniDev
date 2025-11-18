import { CharacterAbout } from '@character/components/character-details/character-about'
import { CharacterLoader } from '@character/components/character-details/character-loader'
import { SeiyuuList } from '@character/components/character-details/seiyuu-list'
import type { CharacterDetails } from '@character/types'
import { DinamicBanner } from '@shared/components/ui/dinamic-banner'
import type { PersonAbout } from '@user/types'
import { getCharacterData } from '@utils/get-character-data'
import { Aside } from 'domains/shared/components/layout/base/Aside'
import { Header } from 'domains/shared/components/layout/base/Header'
import { InfoPageLayout } from 'domains/shared/components/layout/base/InfoPageLayout'
import { useEffect, useState } from 'react'

interface Props {
  slug: string
}

export const CharacterInfo = ({ slug }: Props) => {
  const [character, setCharacter] = useState<CharacterDetails>()
  const [about, setAbout] = useState<PersonAbout>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCharacterData(slug)

      if (data) {
        setCharacter(data)
      }
    }
    fetchData()
  }, [slug])

  useEffect(() => {
    if (!character) return

    const fetchFormatAbout = async () => {
      const about = await fetch(
        `/about?about=${encodeURIComponent(character.character_about ?? '')}`
      ).then((data) => data.json())

      setAbout(about)
    }
    fetchFormatAbout()
  }, [character])

  if (!character ) {
    return <CharacterLoader />
  }

  const nicknames = character.character_nicknames ?? []

  return (
    <InfoPageLayout
      banner={
        <DinamicBanner
          banners={character.animes.map(
            (anime) => anime.banner_image ?? anime.image_large_webp ?? ''
          )}
        />
      }
    >
      <Aside
        title={character.character_name}
        posterImage={character.character_image_url ?? ''}
        smallImage={character.character_small_image_url ?? ''}
      />
      <Header
        title={`${character.character_name} - ${character.character_name_kanji}`}
      >
        {nicknames.length > 0 && (
          <p className="text-l text-Primary-200 mt-2">
            <span className="font-semibol text-Primary-50">Nicknames:</span>{' '}
            {nicknames.join(', ')}
          </p>
        )}
      </Header>
      <CharacterAbout about={about} />
      <SeiyuuList seiyuus={character.voice_actors} />
    </InfoPageLayout>
  )
}
