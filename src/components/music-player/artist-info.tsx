import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { ArtistInfoLoader } from '@components/music-player/artist-info-loader'
import { useFetch } from '@hooks/useFetch'
import { useMusicPlayerStore } from '@store/music-player-store'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { ArtistInfo } from 'types'

export const ArtistInfoComponent = () => {
  const { currentSong } = useMusicPlayerStore()

  const artistName = currentSong?.artist_name ?? ''
  const { data: artist, loading } = useFetch<ArtistInfo>({
    url: `/api/getArtistInfo?artistName=${encodeURIComponent(artistName)}`,
    skip: !artistName,
  })

  if (loading || !artist) {
    return <ArtistInfoLoader />
  }

  return (
    <a
      title={`Info about ${artist.name}`}
      href={`/artist/${normalizeString(artist.name, true, true, true)}_${artist.mal_id}`}
      key={artist.name}
      className="group relative row-start-2 flex flex-col gap-6 overflow-hidden p-4 md:rounded-xl md:p-6"
    >
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden object-cover object-center md:rounded-3xl">
        <Picture
          placeholder={artist.image_small_url || artist.alternative_image_url}
          image={artist.image_url || artist.alternative_image_url}
          alt={artist.name}
          styles=" relative overflow-hidden object-cover object-center  w-full h-full overflow-hidden"
        />
      </div>

      <h3 className="text-lx z-20">About the artist </h3>

      <div className="relative z-20 flex w-full flex-row items-center gap-6 rounded-full p-2">
        <Picture
          placeholder={artist.image_small_url || artist.alternative_image_url}
          image={artist.image_url || artist.alternative_image_url}
          alt={artist.name}
          styles=" relative overflow-hidden object-cover object-center max-w-20 max-h-20 rounded-full w-full h-full overflow-hidden"
        />

        <header className="z-20 flex flex-col gap-2">
          <h4 className="text-l group-hover:text-enfasisColor transition-colors duration-300">
            {artist.name}
          </h4>

          <p className="text-s text-Primary-300 line-clamp-2">
            {artist.birthday || 'Unknown'}
          </p>
        </header>
      </div>

      <p className="text-m text-Primary-200 z-20 line-clamp-3">
        {artist.about}
      </p>
      <Overlay className="bg-Primary-950/95 z-10 h-full w-full backdrop-blur-sm md:rounded-xl" />
      <Overlay className="bg-enfasisColor/5 group-hover:bg-enfasisColor/10 z-10 h-full w-full md:rounded-xl" />
    </a>
  )
}
