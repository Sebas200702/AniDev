import { MusicCard } from '@music/components/music-card/music-card'
import type { AnimeSongWithImage } from '@music/types'
import { useFetch } from '@shared/hooks/useFetch'

export const MusicCardLayout = () => {
  const { data: trending, loading: trendingLoading } = useFetch<
    AnimeSongWithImage[]
  >({
    url: `/music?order_by=score&limit_count=12&anime_year=2025&unique_per_anime=true`,
  })

  if (trendingLoading || !trending)
    return (
      <div>
        <h2 className="subtitle mb-6">Trending now</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-Primary-800/40 aspect aspect-[225/330] animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    )

  return (
    <div>
      <h2 className="subtitle mb-6">Trending now</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {trending?.map((song) => <MusicCard key={song.song_id} song={song} />)}
      </div>
    </div>
  )
}
