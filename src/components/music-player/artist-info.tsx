import type { ArtistInfo } from 'types'
import { ArtistInfoLoader } from '@components/music-player/artist-info-loader'
import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import { useFetch } from '@hooks/useFetch'
import { useMusicPlayerStore } from '@store/music-player-store'

export const ArtistInfoComponent = () => {
  const { currentSong } = useMusicPlayerStore()

  const artistName = currentSong?.artist_name ?? ''
  const { data, loading } = useFetch<ArtistInfo[]>({
    url: `/api/getArtistInfo?artistName=${encodeURIComponent(artistName)}`,
    skip: !artistName,
  })

  if (loading || !data) {
    return <ArtistInfoLoader />
  }

  return (
    <>
      {data.map((artist) => (
        <a
          title={`Info about ${artist.name}`}
          href={`/artist/${normalizeString(artist.name, true, true, true)}_${artist.mal_id}`}
          key={artist.name}
          className="group relative row-start-2 flex flex-col gap-6 overflow-hidden p-4 md:rounded-xl md:p-6"
        >
          <figure className="absolute top-0 left-0 h-full w-full overflow-hidden object-cover object-center md:rounded-3xl">
            <Picture
              image={createImageUrlProxy(
                artist.image_small_url ??
                  artist.alternative_image_url ??
                  `${baseUrl}/placeholder.webp`,
                '0',
                '0',
                'webp'
              )}
              styles=" relative overflow-hidden object-cover object-center  w-full h-full"
            >
              <img
                src={createImageUrlProxy(
                  artist.image_url ??
                    artist.alternative_image_url ??
                    `${baseUrl}/placeholder.webp`,
                  '0',
                  '70',
                  'webp'
                )}
                alt={artist.name}
                className="relative h-full w-full object-cover object-center"
              />
            </Picture>
          </figure>

          <h3 className="text-lx z-20">About the artist </h3>

          <div className="relative z-20 flex w-full flex-row items-center gap-6 rounded-full p-2">
            <figure className="flex h-full max-h-20 w-full max-w-20 overflow-hidden rounded-full">
              <Picture
                image={createImageUrlProxy(
                  artist.image_small_url ??
                    artist.alternative_image_url ??
                    `${baseUrl}/placeholder.webp`,
                  '0',
                  '0',
                  'webp'
                )}
                styles=" relative overflow-hidden object-cover object-center w-20 h-20"
              >
                <img
                  src={createImageUrlProxy(
                    artist.image_url ??
                      artist.alternative_image_url ??
                      `${baseUrl}/placeholder.webp`,
                    '0',
                    '80',
                    'webp'
                  )}
                  alt={artist.name}
                  className="relative h-20 w-20 object-cover object-center"
                />
              </Picture>
            </figure>
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
      ))}
    </>
  )
}
