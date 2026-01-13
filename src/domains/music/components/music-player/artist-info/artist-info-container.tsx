import type { ArtistInfo } from '@artist/types'
import { ArtistInfoComponent } from '@music/components/music-player/artist-info/artist-info'
import { ArtistInfoLoader } from '@music/components/music-player/artist-info/artist-info-loader'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { DataWrapper } from '@shared/components/error/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import { ArtistInfoNoData } from './artist-info-no-data'

export const ArtistInfoContainer = () => {
  const { currentSong } = useMusicPlayerStore()

  const artistName = currentSong?.artist_name ?? ''
  const { data: artist, loading } = useFetch<ArtistInfo>({
    url: `/artist/getArtistInfo?artistName=${encodeURIComponent(artistName)}`,
    skip: !artistName,
  })

  return (
    <DataWrapper
      loading={loading}
      data={artist!}
      noDataFallback={<ArtistInfoNoData />}
      loadingFallback={<ArtistInfoLoader />}
    >
      {(artist) => <ArtistInfoComponent artist={artist} />}
    </DataWrapper>
  )
}
