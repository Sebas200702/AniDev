import { AnimeMusicItem } from '@music/components/music-card/music-detail-card'
import type { AnimeSong } from '@music/types'

import { DataWrapper } from '@shared/components/data-wrapper'
import { AnimeMusicLoader } from './anime-music-loader'

interface Props {
  songs: AnimeSong[]
  loading: boolean
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
  error: Error
}
export const AnimeMusic = ({
  songs,
  loading,
  image,
  placeholder,
  banner_image,
  anime_title,
  error,
}: Props) => {
  return (
    <div className="z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
      <h2 className="text-lxx font-bold">Anime Music</h2>

      <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        {
          <DataWrapper<AnimeSong[]>
            data={songs}
            loading={loading}
            error={error}
            loadingFallback={<AnimeMusicLoader />}
          >
            {(songs) =>
              songs.map((song) => (
                <AnimeMusicItem
                  key={song.song_id}
                  song={song}
                  image={image}
                  placeholder={placeholder}
                  banner_image={banner_image}
                  anime_title={anime_title}
                />
              ))
            }
          </DataWrapper>
        }
      </ul>
    </div>
  )
}
