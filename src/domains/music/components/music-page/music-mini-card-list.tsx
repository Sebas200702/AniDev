import type { AnimeSongWithImage } from '@music/types'
import { useFetch } from '@shared/hooks/useFetch'
import { MusicCard } from '../music-card/music-card'

interface Props {
  title: string
}
export const MusicMiniCardLayout = ({ title }: Props) => {
  const { data: latest, loading: latestLoading } = useFetch<
    AnimeSongWithImage[]
  >({
    url: `/music?order_by=song_id desc&limit_count=12&anime_status=Currently Airing&unique_per_anime=true`,
  })

  if (latestLoading || !latest)
    return (
      <div>
        <h2 className="subtitle mb-10">{title}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-Primary-800/40 h-20 animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    )

  return (
    <div>
      <h2 className="subtitle mb-10">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {latest?.map((song) => (
          <MusicCard key={song.song_id} song={song} isMini />
        ))}
      </div>
    </div>
  )
}
