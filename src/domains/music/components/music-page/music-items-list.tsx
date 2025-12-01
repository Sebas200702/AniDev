import type { AnimeSong } from '@music/types'
import { useFetch } from '@shared/hooks/useFetch'
import { MusicDetailCard } from '../music-card/music-detail-card'

export const MusicItemsLayout = () => {
  const { data: openings, loading: openingsLoading } = useFetch<AnimeSong[]>({
    url: `/music?limit_count=12&unique_per_anime=true&order_by=score&artist_filter=Flow`,
  })

  if (openingsLoading || !openings)
    return (
      <div>
        <h2 className="subtitle mb-3">Openings</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
      <h2 className="subtitle mb-3">Openings</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {openings?.map((song) => (
          <MusicDetailCard key={song.theme_id} song={song} />
        ))}
      </div>
    </div>
  )
}
