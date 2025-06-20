import { navigate } from 'astro:transitions/client'
import { DownloadButton } from '@components/dowload-button'
import { AddToPlayListButton } from '@components/buttons/add-to-playlist-button'
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
  const { currentSong, setCurrentSong, playerRef, isPlaying , list } =
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
      className="group relative bg-Complementary hover:bg-zinc-800 rounded-lg p-4 transition-all duration-300 hover:shadow-xl aspect-[225/330]"
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

      <footer className="space-y-2 mt-2 w-full">
        <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:underline">
          {song.song_title}
        </h3>
        <p className="text-neutral-400 text-sm line-clamp-1">
          {song.artist_name || 'Unknown Artist'}
        </p>
        <button
          className="absolute right-3 bottom-2 p-2 cursor-poiter z-10"
          onClick={(e) => handleMenuClick(e)}
        >
          <MoreOptionsIcon className="h-4 w-4 " />
        </button>
      </footer>

      <div
        ref={menuRef}
        className="absolute z-50 bg-zinc-900/95 backdrop-blur-md shadow-2xl border border-zinc-700/50 rounded-lg min-w-[180px] max-w-[220px] p-1 right-8 translate-y-1/2 translate-x-full flex-col hidden transition-all duration-200 ease-out"
      >

        <AddToPlayListButton song={song} isInPlayList={isInPlaylist} clasName='w-full flex items-center gap-3 hover:text-enfasisColor px-3 py-2.5 text-sm hover:bg-zinc-800/80 rounded-md transition-all duration-150 group' label={`${!isInPlaylist ? 'Add' : 'Remove'} `}/>
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
