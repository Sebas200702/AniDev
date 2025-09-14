import { ArtistAbout } from '@artist/components/artist-info/ArtistAbout'
import { ArtistLoader } from '@artist/components/artist-info/ArtistLoader'
import { ArtistSongList } from '@artist/components/artist-info/ArtistSongList'
import type { ArtistInfo as ArtistInfoType } from '@artist/types'
import type { AnimeSongWithImage } from '@music/types'
import { Aside } from '@shared/components/layout/base/Aside'
import { Header } from '@shared/components/layout/base/Header'
import { InfoPageLayout } from '@shared/components/layout/base/InfoPageLayout'
import { DinamicBanner } from '@shared/components/ui/dinamic-banner'
import { useFetch } from '@shared/hooks/useFetch'
import type { PersonAbout } from '@user/types'
import { useEffect, useState } from 'react'
interface Props {
  name: string
}

export const ArtistInfo = ({ name }: Props) => {
  const [about, setAbout] = useState<PersonAbout>()
  const { data: artistInfo, loading } = useFetch<ArtistInfoType>({
    url: `/api/getArtistInfo?artistName=${name}`,
  })
  const { data: songs, loading: songsLoading } = useFetch<AnimeSongWithImage[]>(
    {
      url: `/api/music?artist_filter=${name}`,
    }
  )

  useEffect(() => {
    if (loading || !artistInfo) return

    const fetchFormatAbout = async () => {
      const about = await fetch(
        `/api/about?about=${encodeURIComponent(artistInfo.about)}`
      ).then((data) => data.json())

      setAbout(about)
    }
    fetchFormatAbout()
  }, [loading, artistInfo])

  if (loading || !artistInfo || !about || !songs || songsLoading) {
    return <ArtistLoader />
  }

  const banners = songs.map((song) => song.banner_image)

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
