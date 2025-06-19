import { AnimeMusicItem } from '@components/anime-info/anime-music-item'
import { useMusicPlayerStore } from '@store/music-player-store'

export const MusicPlayList = () => {
  const { list } = useMusicPlayerStore()

  return (
    <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
      {list.map((song) => (
        <AnimeMusicItem
          key={song.song_id}
          song={song}
          anime_title={song.anime_title}
          banner_image={song.banner_image}
          image={song.image}
          placeholder={song.placeholder}
        />
      ))}
    </ul>
  )
}
