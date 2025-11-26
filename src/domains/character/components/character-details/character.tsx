import { CharacterAbout } from '@character/components/character-details/character-about'
import { CharacterLoader } from '@character/components/character-details/character-loader'
import { SeiyuuList } from '@character/components/character-details/seiyuu-list'
import type { CharacterDetails } from '@character/types'
import { DinamicBanner } from '@shared/components/ui/dinamic-banner'

import { Aside } from '@shared/components/layout/base/Aside'
import { Header } from '@shared/components/layout/base/Header'
import { InfoPageLayout } from '@shared/components/layout/base/InfoPageLayout'

import type { PersonAbout } from '@user/types'

interface Props {
  character: CharacterDetails | null
  about: PersonAbout | null
}

export const CharacterInfo = ({ character, about }: Props) => {
  if (!character) {
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
