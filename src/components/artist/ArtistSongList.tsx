import type { AnimeSongWithImage } from 'types'
import { InfoSection } from '@components/shared/InfoSection'
import { AnimeMusicItem } from '@components/music/anime-music-item'

interface Props {
  songs: AnimeSongWithImage[]
}
export const ArtistSongList = ({ songs }: Props) => {
  return (
    <InfoSection title='Songs'>
      
        <ul className="flex flex-col gap-4 w-full">
          {songs.map((song) => (
            <AnimeMusicItem 
            key={song.song_id}
            song={song} 
            image={song.image} 
            anime_title={song.anime_title}
            banner_image={song.banner_image}
            />
          ))}
        </ul>
     
      </InfoSection>
 
  )
}
