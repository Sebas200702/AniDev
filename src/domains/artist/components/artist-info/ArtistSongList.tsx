import { MusicCard } from '@music/components/music-card/music-card'
import { InfoSection } from 'domains/shared/components/layout/base/InfoSection'
import type { AnimeSongWithImage } from 'types'

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
