import { MusicCard } from '@music/components/music-card/music-card'
import type { AnimeSongWithImage } from '@music/types'
import { InfoSection } from 'domains/shared/components/layout/base/InfoSection'

interface Props {
  songs: AnimeSongWithImage[]
}
export const ArtistSongList = ({ songs }: Props) => {
  return (
    <InfoSection title="Songs" ulClassName="w-full">
      {songs.map((song) => (
        <MusicCard key={song.song_id} song={song} isMini />
      ))}
    </InfoSection>
  )
}
