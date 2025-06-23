import { navigate } from 'astro:transitions/client'
import { AddToPlayListButton } from '@components/buttons/add-to-playlist-button'
import { PauseIcon } from '@components/icons/pause-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useSearchStoreResults } from '@store/search-results-store'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'
import type { AnimeSong, AnimeSongWithImage } from 'types'

export const AnimeMusicItem = ({
  song,
  image,
  placeholder,
  banner_image,
  anime_title,
}: {
  song: AnimeSong
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
}) => {
  const [heights, setHeights] = useState([0, 0, 0, 0])
  const { setSearchIsOpen } = useSearchStoreResults()

  const { isPlaying, currentSong, list, playerRef, canPlay, isMinimized } =
    useMusicPlayerStore()
  const isInPlaylist = list.some(
    (songList) => songList.song_id === song.song_id
  )

  const isCurrentSong = currentSong?.song_id === song.song_id
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    isPlaying && canPlay
      ? playerRef.current?.pause()
      : playerRef.current?.play()
  }

  const handleClick = () => {
    if (isCurrentSong && isMinimized) return
    setSearchIsOpen(false)
    navigate(`/music/${normalizeString(song.song_title)}_${song.theme_id}`)
  }

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined

    if (isPlaying) {
      interval = setInterval(() => {
        const newHeights = Array.from(
          { length: 4 },
          () => Math.floor(Math.random() * 24) + 8
        )
        setHeights(newHeights)
      }, 150)
    } else {
      setHeights([0, 0, 0, 0])
    }

    return () => clearInterval(interval)
  }, [isPlaying])

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'opening':
      case 'op':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'ending':
      case 'ed':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'insert':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="group relative transition-all duration-300 ease-in-out md:hover:translate-x-2">
      <article
        onClick={handleClick}
        title={song.song_title}
        className="hover:bg-Primary-900 group border-enfasisColor group relative flex aspect-[100/28] h-full w-full cursor-pointer flex-row items-start overflow-hidden rounded-lg border-l-2 bg-zinc-800 transition-colors duration-300 ease-in-out md:max-h-36 md:gap-2"
      >
        <Picture
          image={placeholder}
          styles="aspect-[225/330] h-full overflow-hidden rounded-l-lg relative"
        >
          {isCurrentSong && (
            <div className="bg-Complementary/30 absolute inset-0 z-10 flex items-center justify-center gap-[3px]">
              {heights.map((height, index) => (
                <div
                  key={index}
                  className="bg-enfasisColor w-[3px] rounded-md transition-all duration-150 ease-out group-hover:opacity-0"
                  style={{ height: `${height}px` }}
                />
              ))}

              <button
                className="text-enfasisColor pointer-events-none absolute inset-0 z-20 mx-auto flex h-full w-full cursor-pointer items-center justify-center p-4 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-90 disabled:pointer-events-none"
                onClick={(e) => handlePlay(e)}
                disabled={!canPlay}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          )}

          <img
            src={image}
            alt={song.song_title}
            className="relative aspect-[225/330] h-full rounded-l-lg object-cover object-center"
          />
          <Overlay className="to-Primary-950/60 h-full w-full bg-gradient-to-b from-transparent" />
        </Picture>

        {song.type && (
          <span
            className={`absolute top-2 right-2 flex-shrink-0 rounded-full border p-1 text-xs font-medium md:px-2 md:py-1 ${getTypeColor(song.type)}`}
          >
            {song.type.toUpperCase()}
          </span>
        )}

        <AddToPlayListButton
          song={{
            image,
            banner_image,
            anime_title,
            placeholder,
            ...song,
          }}
          isInPlayList={isInPlaylist}
          clasName="hover:bg-Primary-950 absolute right-2 bottom-2 z-10 flex-shrink-0 cursor-pointer rounded-full p-2 transition-colors duration-300"
        />

        <footer className="flex h-full w-full max-w-[60%] flex-col items-start gap-2 p-2 md:p-4">
          <h3 className="text-md group-hover:text-enfasisColor/80 line-clamp-1 font-bold text-pretty transition-colors duration-300 ease-in-out select-none md:text-lg">
            {song.song_title}
          </h3>
          <p className="text-xs text-gray-500 select-none md:text-sm">
            {song.artist_name}
          </p>
        </footer>
      </article>
    </div>
  )
}
