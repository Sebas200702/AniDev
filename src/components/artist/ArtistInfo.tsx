import { DinamicBanner } from '@components/anime-info/dinamic-banner'
import { ArtistLoader } from '@components/artist/ArtistLoader'
import { ArtistSongList } from '@components/artist/ArtistSongList'
import { Aside } from '@components/shared/Aside'
import { Header } from '@components/shared/Header'
import { InfoPageLayout } from '@components/shared/InfoPageLayout'
import { useFetch } from '@hooks/useFetch'
import { useEffect, useState } from 'react'
import type {
  AnimeSongWithImage,
  ArtistInfo as ArtistInfoType,
  PersonAbout,
} from 'types'
import { ArtistAbout } from './ArtistAbout'
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
