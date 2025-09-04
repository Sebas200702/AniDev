import { ArtistLoader } from '@components/artist/ArtistLoader'
import { ArtistSongList } from '@components/artist/ArtistSongList'
import { CharacterAbout } from '@components/character-info/character-about'
import { Aside } from '@components/shared/Aside'
import { Header } from '@components/shared/Header'
import { InfoPageLayout } from '@components/shared/InfoPageLayout'
import { useFetch } from '@hooks/useFetch'
import { useEffect, useState } from 'react'
import type { AnimeSongWithImage, ArtistInfo, PersonAbout } from 'types'

interface Props {
  name: string
}

export const ArtistInfo = ({ name }: Props) => {
  const [about, setAbout] = useState<PersonAbout>()
  const { data: artistInfo, loading } = useFetch<ArtistInfo>({
    url: `/api/getArtistInfo?artistName=${name}`,
  })
  const { data: songs, loading: songsLoading } = useFetch<AnimeSongWithImage[]>({
    url: `/api/music?artist_filter=${name}`,
  })

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

  return (
    <InfoPageLayout banner={null}>
      <Aside
        title={artistInfo.name}
        posterImage={artistInfo.image}
        smallImage={artistInfo.image}
      />
      <Header title={artistInfo.name} />
      <CharacterAbout about={about} />
      <ArtistSongList songs={songs} />
    </InfoPageLayout>
  )
}
