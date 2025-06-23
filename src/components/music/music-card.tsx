import { navigate } from 'astro:transitions/client'
import { AddToPlayListButton } from '@components/buttons/add-to-playlist-button'
import { DownloadButton } from '@components/dowload-button'
import { Picture } from '@components/picture'
import { MoreOptionsIcon } from '@icons/more-options-icon'
import { PauseIcon } from '@icons/pause-icon'
import { PlayIcon } from '@icons/play-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import { useRef } from 'react'
import { useEffect } from 'react'
import type { AnimeSongWithImage } from 'types'

export const MusicCard = ({ song }: { song: AnimeSongWithImage }) => {
  const { currentSong, setCurrentSong, playerRef, isPlaying, list } =
    useMusicPlayerStore()

  const menuRef = useRef<HTMLDivElement>(null)
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
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        menuRef.current.classList.replace('flex', 'hidden')
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    menuRef.current?.classList.replace('hidden', 'flex')
  }
  return (
    <article
      className="group bg-Complementary relative aspect-[225/330] rounded-lg p-4 transition-all duration-300 hover:bg-zinc-800 hover:shadow-xl"
      onClick={() =>
        navigate(`/music/${normalizeString(song.song_title)}_${song.theme_id}`)
      }
    >
      <div className="relative mb-4">
        <Picture
          image={song.placeholder}
          styles="relative aspect-square rounded-md overflow-hidden shadow-lg aspect-square"
        >
          <img
            src={song.image}
            alt={song.song_title}
            className="aspect-square w-full rounded-md object-cover transition-transform duration-300"
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

      <footer className="mt-2 w-full space-y-2">
        <h3 className="md:text-md line-clamp-1 font-semibold text-white group-hover:underline">
          {song.song_title}
        </h3>
        <p className="line-clamp-1 text-xs text-neutral-400 md:text-sm">
          {song.artist_name || 'Unknown Artist'}
        </p>
        <button
          className="cursor-poiter absolute right-3 bottom-2 z-10 p-2"
          onClick={(e) => handleMenuClick(e)}
        >
          <MoreOptionsIcon className="h-4 w-4" />
        </button>
      </footer>

      <div
        ref={menuRef}
        className="absolute right-8 z-50 hidden flex-col rounded-lg border border-zinc-700/50 bg-zinc-900/95 p-1 shadow-2xl backdrop-blur-md transition-all duration-200 ease-out md:max-w-[220px] md:min-w-[180px] md:translate-x-full md:translate-y-1/2"
      >
        <AddToPlayListButton
          song={song}
          isInPlayList={isInPlaylist}
          clasName="w-full flex items-center gap-3 hover:text-enfasisColor px-3 py-2.5 text-sm hover:bg-zinc-800/80 rounded-md transition-all duration-150 group"
          label={`${!isInPlaylist ? 'Add' : 'Remove'} `}
        />
        <DownloadButton
          styles="w-full flex items-center gap-3 hover:text-enfasisColor px-3 py-2.5 text-sm hover:bg-zinc-800/80 rounded-md transition-all duration-150 group"
          url={song.audio_url}
          title={song.song_title}
          metadata={{
            type: 'audio',
            coverUrl: song.image,
            artist: song.artist_name ?? 'Unknown Artist',
          }}
        />
      </div>
    </article>
  )
}
