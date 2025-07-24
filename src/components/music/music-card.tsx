import { navigate } from 'astro:transitions/client'
import { AddToPlayListButton } from '@components/buttons/add-to-playlist-button'
import { ShareButton } from '@components/buttons/share-button'
import { DownloadButton } from '@components/dowload-button'
import { MoreOptions } from '@components/more-options'
import { Picture } from '@components/picture'
import { PauseIcon } from '@icons/pause-icon'
import { PlayIcon } from '@icons/play-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeSongWithImage } from 'types'

export const MusicCard = ({ song }: { song: AnimeSongWithImage }) => {
  const { currentSong, setCurrentSong, playerRef, isPlaying, list } =
    useMusicPlayerStore()

  const isInPlaylist = list.some(
    (songList) => songList.song_id === song.song_id
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentSong?.song_id !== song.song_id) {
      setCurrentSong(song)
    }

    isPlaying ? playerRef.current?.pause() : playerRef.current?.play()
  }

  return (
    <article
      className="group bg-Complementary hover:border-enfasisColor/40 border-enfasisColor/5 relative aspect-[225/330] rounded-lg border-1 p-3 transition-all duration-300 hover:cursor-pointer hover:bg-zinc-800 hover:shadow-xl md:p-4"
      onClick={() =>
        navigate(`/music/${normalizeString(song.song_title)}_${song.theme_id}`)
      }
    >
      <div className="relative mb-4">
        <Picture
          image={song.placeholder}
          styles="relative aspect-square rounded-md overflow-hidden shadow-lg aspect-square h-full"
        >
          <img
            src={song.image}
            alt={song.song_title}
            className="aspect-square h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-102"
          />
        </Picture>

        <div className="absolute right-2 bottom-2 z-20 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            className="bg-enfasisColor text-Primary-50 cursor-pointer rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-105"
            onClick={(e) => handleClick(e)}
          >
            {isPlaying && currentSong?.song_id === song.song_id ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <footer className="mt-2 flex w-full flex-col space-y-2">
        <h3 className="md:text-md text-enfasisColor line-clamp-1 font-semibold group-hover:underline">
          {song.song_title}
        </h3>
        <p className="line-clamp-1 text-xs text-white md:text-sm">
          {song.artist_name || 'Unknown Artist'}
        </p>
        <MoreOptions className="self-end">
          <AddToPlayListButton
            song={song}
            isInPlayList={isInPlaylist}
            clasName="hover:text-enfasisColor group  cursor-pointer rounded-md  p-1 text-sm transition-all duration-300  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          <DownloadButton
            styles="hover:text-enfasisColor group  cursor-pointer rounded-md  p-1 text-sm transition-all duration-300  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={song.audio_url}
            title={song.song_title}
            themeId={song.theme_id ?? 0}
            showLabel={false}
          />
          <ShareButton
            className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
            title={song.song_title}
            text={`Listen to ${song.song_title} by ${song.artist_name}`}
          />
        </MoreOptions>
      </footer>
    </article>
  )
}
