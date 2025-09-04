import { DinamicBanner } from '@components/anime-info/dinamic-banner'
import { CharacterAbout } from '@components/character-info/character-about'
import { SeiyuuList } from '@components/character-info/seiyuu-list'
import { Aside } from '@components/shared/Aside'
import { Header } from '@components/shared/Header'
import { InfoPageLayout } from '@components/shared/InfoPageLayout'
import { getCharacterData } from '@utils/get-character-data'
import { useEffect, useState } from 'react'
import type { CharacterDetails, PersonAbout } from 'types'
import { CharacterLoader } from './character-loader'

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
        `/api/about?about=${encodeURIComponent(character.character_about ?? '')}`
      ).then((data) => data.json())

      setAbout(about)
    }
    fetchFormatAbout()
  }, [character])

  if (!character || !about) {
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
      <Header title={`${character.character_name} - ${character.character_name_kanji}`}>
        {nicknames.length > 0 && (
          <p className="mt-2 text-l text-Primary-200">
            <span className="font-semibol text-Primary-50">Nicknames:</span>{' '}
            {nicknames.join(', ')}
          </p>
        )}
      </Header>
      <CharacterAbout about={about} />
      <SeiyuuList Seiyuus={character.voice_actors} />
    </InfoPageLayout>
  )
}
