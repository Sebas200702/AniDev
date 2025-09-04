import type { AnimeSongWithImage } from 'types'
import { Song } from '@components/artist/Song'

interface Props {
  songs: AnimeSongWithImage[]
}
export const ArtistSongList = ({ songs }: Props) => {
  return (
    <section className="anime-show-box col-span-full xl:col-span-4">
      <div className="flex flex-col gap-4">
        <h2 className="title text-2xl">Songs</h2>
        <ul className="flex flex-col gap-4">
          {songs.map((song) => (
            <Song key={song.song_id} song={song} />
          ))}
        </ul>
      </div>
    </section>
  )
}
