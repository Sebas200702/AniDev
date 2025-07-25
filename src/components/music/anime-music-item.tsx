import { navigate } from 'astro:transitions/client'
import { AddToPlayListButton } from '@components/buttons/add-to-playlist-button'
import { ShareButton } from '@components/buttons/share-button'
import { MoreOptions } from '@components/common/more-options'
import { PauseIcon } from '@components/icons/pause-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { getTypeMusicColor } from '@utils/get-type-music-color'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'
import type { AnimeSong } from 'types'

export const AnimeMusicItem = ({
  song,
  image,
  placeholder,
  banner_image,
  anime_title,
  isInMusicPlayer = false,
}: {
  song: AnimeSong
  image: string
  placeholder: string
  banner_image: string
  anime_title: string
  isInMusicPlayer?: boolean
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({ id: song.song_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  }
  const handleProps = { ...attributes, ...listeners }

  const [heights, setHeights] = useState([0, 0, 0, 0])

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
    if (isCurrentSong && !isMinimized) return
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

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ease-out ${isDragging ? 'z-50' : ''} hover:bg-Primary-900 group group border-enfasisColor group relative flex h-full w-full cursor-pointer flex-row items-start rounded-lg border-l-4 bg-zinc-800 transition-all duration-300 ease-in-out md:max-h-36 md:gap-2 md:hover:translate-x-1`}
      onClick={handleClick}
      title={song.song_title}
    >
      <div className="flex aspect-[100/30] h-full w-full flex-row overflow-hidden rounded-lg md:max-h-36">
        <div className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-lg">
          <img
            src={createImageUrlProxy(
              banner_image || image,
              '100',
              '70',
              'webp'
            )}
            alt={song.song_title}
            className="aspect-[100/30] w-full object-cover object-center"
          />
          <Overlay className="bg-Primary-950/90 h-full w-full overflow-hidden rounded-lg backdrop-blur-sm" />
        </div>
        {isInMusicPlayer && (
          <div
            {...handleProps}
            className="bg-enfasisColor/50 absolute top-1/2 right-0 z-10 flex h-full -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-r-md p-1 shadow-lg backdrop-blur-sm transition-all duration-200 select-none active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="pointer-events-none h-4 w-4 text-white"
            >
              <circle cx="8" cy="6" r="1.5" />
              <circle cx="8" cy="12" r="1.5" />
              <circle cx="8" cy="18" r="1.5" />
              <circle cx="16" cy="6" r="1.5" />
              <circle cx="16" cy="12" r="1.5" />
              <circle cx="16" cy="18" r="1.5" />
            </svg>
          </div>
        )}
        <Picture
          image={createImageUrlProxy(placeholder, '0', '0', 'webp')}
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
            src={createImageUrlProxy(image, '0', '70', 'webp')}
            alt={song.song_title}
            className="relative aspect-[225/330] h-full rounded-l-lg object-cover object-center"
          />
          <Overlay className="group-hover:bg-Primary-950/40 bg-Primary-950/0 h-full w-full" />
        </Picture>

        {song.type && (
          <span
            className={`absolute top-2 flex-shrink-0 rounded-full border p-1 text-xs font-medium md:px-2 md:py-1 ${getTypeMusicColor(song.type)} ${isInMusicPlayer ? 'right-8 md:right-10' : 'right-2 md:right-3'}`}
          >
            {song.type.toUpperCase()}
          </span>
        )}

        <MoreOptions
          className={`absolute md:bottom-3 ${isInMusicPlayer ? 'right-8 md:right-10' : 'right-2 md:right-3'} bottom-2 z-10 md:flex`}
        >
          <AddToPlayListButton
            song={{
              image,
              banner_image,
              anime_title,
              placeholder,
              ...song,
            }}
            isInPlayList={isInPlaylist}
            clasName="hover:text-enfasisColor group  cursor-pointer rounded-md  p-1 text-sm transition-all duration-300  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          <ShareButton
            className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
            title={song.song_title}
            text={`Listen ${song.song_title} on AniDev`}
          />
          <button
            onClick={handleClick}
            title={`Listen ${song.song_title}`}
            className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlayIcon className="h-4 w-4" />
          </button>
        </MoreOptions>

        <footer className="z-10 flex w-full max-w-[65%] flex-col items-start justify-between px-4 py-2 md:justify-center md:gap-4 md:p-4">
          <div className="flex w-full flex-col items-start space-x-1 truncate text-pretty ease-in-out select-none md:flex-row">
            <span className="text-m truncate text-white">
              {song.song_title}
            </span>

            {song.artist_name && (
              <button
                title={`View ${song.artist_name} profile`}
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/artist/${normalizeString(song.artist_name || '')}`)
                }}
                className="text-sxx text-Primary-300 flex flex-row items-end gap-1 truncate"
              >
                By
                <strong className="text-Primary-100 text-m hover:text-enfasisColor cursor-pointer truncate transition-all duration-300">
                  {' '}
                  {song.artist_name}
                </strong>
              </button>
            )}
          </div>
          <span className="text-sxx text-Primary-300 flex w-full flex-row items-end truncate">
            From
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(
                  `/anime/${normalizeString(anime_title)}_${song.anime_id}`
                )
              }}
              title={`View ${anime_title} details`}
              className="ml-1 cursor-pointer truncate"
            >
              <strong className="text-sx text-Primary-100 truncate hover:underline">
                {anime_title}
              </strong>
            </button>
          </span>
        </footer>
      </div>
    </article>
  )
}
