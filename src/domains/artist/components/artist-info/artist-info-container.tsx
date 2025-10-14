import { useEffect, useMemo, useState } from 'react'

import type { AnimeSongWithImage } from '@music/types'
import { ArtistInfo } from './artist-info'
import type { ArtistInfo as ArtistInfoType } from '@artist/types'
import { ArtistLoader } from '@artist/components/artist-info/artist-info-loader'
import { DataWrapper } from '@shared/components/data-wrapper'
import type { PersonAbout } from '@user/types'
import { useFetch } from '@shared/hooks/useFetch'

interface Props {
  name: string
}
interface ArtistCompleteInfo {
  artistInfo: ArtistInfoType
  banners: string[]
  about: PersonAbout
  songs: AnimeSongWithImage[]
}

export const ArtistInfoContainer = ({ name }: Props) => {
  const [about, setAbout] = useState<PersonAbout>()
  const {
    data: artistInfo,
    loading: infoLoading,
    error: infoError,
  } = useFetch<ArtistInfoType>({
    url: `/api/getArtistInfo?artistName=${name}`,
  })

  const {
    data: songs,
    loading: songsLoading,
    error: songsError,
  } = useFetch<AnimeSongWithImage[]>({
    url: `/api/music?artist_filter=${name}`,
  })

  const banners = songs?.map((song) => song.banner_image) ?? []

  useEffect(() => {
    if (infoLoading || !artistInfo?.about) return

    const fetchFormatAbout = async () => {
      const res = await fetch(
        `/api/about?about=${encodeURIComponent(artistInfo.about)}`
      )
      const about = await res.json()
      setAbout(about)
    }

    fetchFormatAbout()
  }, [infoLoading, artistInfo])

  const loading = infoLoading || songsLoading
  const error = infoError || songsError

  const artistCompleteInfo: ArtistCompleteInfo | null = useMemo(() => {
    if (!artistInfo || !about || !songs?.length) return null

    return {
      artistInfo,
      banners,
      about,
      songs,
    }
  }, [artistInfo, banners, about, songs])

  return (
    <DataWrapper<ArtistCompleteInfo>
      loading={loading}
      error={error}
      data={artistCompleteInfo!}
      loadingFallback={<ArtistLoader />}
      noDataFallback={<ArtistLoader />}
    >
      {(data) => (
        <ArtistInfo
          artistInfo={data.artistInfo}
          banners={data.banners}
          about={data.about}
          songs={data.songs}
        />
      )}
    </DataWrapper>
  )
}
