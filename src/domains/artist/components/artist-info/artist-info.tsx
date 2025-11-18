import { ArtistAbout } from '@artist/components/artist-info/artist-info-about'
import { ArtistSongList } from '@artist/components/artist-info/artist-info-song-list'
import type { ArtistInfo as ArtistInfoType } from '@artist/types'
import type { AnimeSongWithImage } from '@music/types'
import { Aside } from '@shared/components/layout/base/Aside'
import { Header } from '@shared/components/layout/base/Header'
import { InfoPageLayout } from '@shared/components/layout/base/InfoPageLayout'
import { DinamicBanner } from '@shared/components/ui/dinamic-banner'
import type { PersonAbout } from '@user/types'

interface Props {
  artistInfo: ArtistInfoType
  banners: string[]
  about: PersonAbout
  songs: AnimeSongWithImage[]
}

export const ArtistInfo = ({ artistInfo, banners, about, songs }: Props) => {
  return (
    <InfoPageLayout banner={<DinamicBanner banners={banners} />}>
      <Aside
        title={artistInfo.name}
        posterImage={artistInfo.image_url}
        smallImage={artistInfo.image_small_url}
      />
      <Header title={artistInfo.name} />
      <ArtistAbout about={about} />
      <ArtistSongList songs={songs} />
    </InfoPageLayout>
  )
}
