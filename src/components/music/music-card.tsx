import { PauseIcon } from '@components/icons/pause-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import { navigate } from 'astro:transitions/client'
import type { AnimeSongWithImage } from 'types'

export const MusicCard = ({ song }: { song: AnimeSongWithImage }) => {
  const { currentSong, setCurrentSong, playerRef, isPlaying } =
    useMusicPlayerStore()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentSong?.song_id !== song.song_id) {
      setCurrentSong(song)
    }

    isPlaying ? playerRef.current?.pause() : playerRef.current?.play()
  }
  return (
    <article className="group relative bg-Complementary hover:bg-zinc-800 rounded-lg p-4 transition-all duration-300 hover:shadow-xl aspect-[225/330]"
    onClick={() => navigate(`/music/${normalizeString(song.song_title)}_${song.theme_id}`)}
    >

        <div className="relative mb-4">
          <Picture
            image={song.placeholder}
            styles="relative aspect-square rounded-md overflow-hidden shadow-lg aspect-square"
          >
            <img
              src={song.image}
              alt={song.song_title}
              className="w-full  object-cover transition-transform duration-300 aspect-square rounded-md"
            />
          </Picture>

          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20">
            <button
              className="bg-enfasisColor cursor-pointer text-Primary-50 rounded-full p-3 shadow-2xl hover:scale-105 transition-all duration-200"
              onClick={(e) => handleClick(e)}
            >
              {isPlaying && currentSong?.song_id === song.song_id ? (
                <PauseIcon className="w-5 h-5 " />
              ) : (
                <PlayIcon className="w-5 h-5 " />
              )}
            </button>
          </div>
        </div>

        <footer className="space-y-1 mt-2">
          <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:underline">
            {song.song_title}
          </h3>
          <p className="text-neutral-400 text-sm line-clamp-1">
            {song.artist_name || 'Unknown Artist'}
          </p>
        </footer>

    </article>
  )
}
