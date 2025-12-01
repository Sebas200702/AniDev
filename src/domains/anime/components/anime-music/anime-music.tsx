import { MusicDetailCard } from '@music/components/music-card/music-detail-card'
import type { AnimeSong } from '@music/types'

interface Props {
  songs: AnimeSong[]
}
export const AnimeMusic = ({ songs }: Props) => {
  return (
    <div className="z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
      <h2 className="text-lxx font-bold">Anime Music</h2>

      <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        {songs.map((song) => (
          <MusicDetailCard key={song.theme_id} song={song} />
        ))}
      </ul>
    </div>
  )
}
