import { useFetch } from '@hooks/useFetch'
import type { AnimeSongWithImage } from 'types'
import { AnimeMusicItem } from './anime-music-item'

export const EndingsSection = () => {
  const { data: endings, loading: endingsLoading } = useFetch<
    AnimeSongWithImage[]
  >({
    url: `/api/music?type_music=ed&limit_count=12&unique_per_anime=true`,
  })

  if (endingsLoading || !endings)
    return (
      <div>
        <h2 className="mb-3 subtitle">Endings</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 ">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-Primary-800/40 h-40 animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    )

  return (
    <div>
      <h2 className="mb-3 subtitle">Endings</h2>
      <div className="grid grid-cols-2 gap-3  md:grid-cols-3">
        {endings?.map((song) => (
          <AnimeMusicItem
            key={song.song_id}
            song={song}
            image={song.image}
            placeholder={song.placeholder}
            banner_image={song.banner_image}
            anime_title={song.anime_title}
          />
        ))}
      </div>
    </div>
  )
}
