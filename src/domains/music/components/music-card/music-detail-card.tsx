import { navigate } from 'astro:transitions/client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSong } from '@music/types'
import { AddToPlayListButton } from '@shared/components/buttons/add-to-playlist-button'
import { DownloadButton } from '@shared/components/buttons/download-button'
import { ShareButton } from '@shared/components/buttons/share-button'
import { PauseIcon } from '@shared/components/icons/watch/pause-icon'
import { PlayIcon } from '@shared/components/icons/watch/play-icon'
import { Overlay } from '@shared/components/layout/overlay'
import { Picture } from '@shared/components/media/picture'
import { MoreOptions } from '@shared/components/ui/more-options'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { getTypeMusicColor } from '@utils/get-type-music-color'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'

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
  placeholder?: string
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

  const { isPlaying, currentSong, list, playerRef, canPlay } =
    useMusicPlayerStore()
  const isInPlaylist = list.some(
    (songList) => songList.song_id === song.song_id
  )

  const isCurrentSong = currentSong?.song_id === song.song_id

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (isCurrentSong) {
      isPlaying && canPlay
        ? playerRef.current?.pause()
        : playerRef.current?.play()
    }
  }

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/artist/${normalizeString(song.artist_name || '')}`)
  }

  const handleAnimeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/anime/${normalizeString(anime_title)}_${song.anime_id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
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
      className={`anime-music-item transition-all duration-200 ease-out ${isDragging ? 'z-50' : ''} group group border-enfasisColor group relative flex aspect-[100/30] max-h-36 w-full cursor-pointer flex-row items-start overflow-hidden rounded-lg border-l-4 transition-all duration-300 ease-in-out md:gap-2 md:hover:translate-x-1`}
      ref={setNodeRef}
      style={style}
    >
      <a
        href={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
        className="focus:ring-enfasisColor focus:ring-offset-Primary-950 flex h-full w-full rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label={`Play ${song.song_title} by ${song.artist_name || 'Unknown artist'}`}
      >
        <div className="absolute h-full w-full">
          <Picture
            image={banner_image ?? image}
            isBanner
            placeholder={banner_image ?? image}
            alt={song.song_title}
            styles="h-full w-full object-cover object-center blur-sm "
          />
          <Overlay className="bg-Primary-950/90 h-full w-full overflow-hidden" />
        </div>

        <div className="relative aspect-[225/330] h-full overflow-hidden rounded-l-lg">
          <Picture
            placeholder={placeholder ?? image}
            image={image}
            alt={song.song_title}
            styles="aspect-[225/330] h-full overflow-hidden rounded-l-lg relative"
          />
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
                className="text-enfasisColor focus:ring-enfasisColor pointer-events-none absolute inset-0 z-20 mx-auto flex h-full w-full cursor-pointer items-center justify-center p-4 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-90 focus:ring-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
                onClick={handlePlay}
                disabled={!canPlay}
                aria-label={isPlaying ? 'Pause song' : 'Play song'}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
          <Overlay className="group-hover:bg-Primary-950/40 bg-Primary-950/0 h-full w-full" />
        </div>

        {song.type && (
          <span
            className={`absolute top-2 flex-shrink-0 rounded-full border p-1 text-xs font-medium md:px-2 md:py-1 ${getTypeMusicColor(song.type)} ${isInMusicPlayer ? 'right-8 md:right-10' : 'right-2 md:right-3'} pointer-events-none`}
          >
            {song.type.toUpperCase()}
          </span>
        )}

        <footer className="z-10 flex h-full w-full max-w-[65%] flex-col items-start justify-between px-4 py-2 md:justify-center md:gap-4 md:p-4">
          <div className="flex w-full flex-col items-start space-x-1 truncate text-pretty ease-in-out select-none md:flex-row">
            <span className="text-m truncate text-white">
              {song.song_title}
            </span>

            {song.artist_name && (
              <span className="text-sxx text-Primary-300 flex w-min flex-row items-end gap-1 truncate md:w-auto">
                By
                <button
                  onClick={handleArtistClick}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => handleArtistClick(e as any))
                  }
                  tabIndex={0}
                  title={`View ${song.artist_name} profile`}
                  className="text-Primary-100 text-m hover:text-enfasisColor cursor-pointer truncate underline-offset-2 transition-all duration-300 hover:underline focus:outline-none"
                  aria-label={`Go to ${song.artist_name} profile`}
                >
                  <strong>{song.artist_name}</strong>
                </button>
              </span>
            )}
          </div>
          {anime_title && (
            <span className="text-sxx text-Primary-300 flex w-full flex-row items-end truncate">
              From
              <button
                onClick={handleAnimeClick}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => handleAnimeClick(e as any))
                }
                tabIndex={0}
                title={`View ${anime_title} details`}
                className="hover:text-enfasisColor ml-1 cursor-pointer truncate rounded transition-all duration-300"
                aria-label={`Go to ${anime_title} details`}
              >
                <strong className="text-sx text-Primary-100 truncate underline-offset-2 hover:underline">
                  {anime_title}
                </strong>
              </button>
            </span>
          )}
        </footer>
      </a>

      <div
        className={`absolute md:bottom-3 ${isInMusicPlayer ? 'right-8 md:right-10' : 'right-2 md:right-3'} pointer-events-auto bottom-2 z-20`}
      >
        <MoreOptions className="md:flex">
          <AddToPlayListButton
            song={{
              image,
              banner_image,
              anime_title,
              placeholder:
                placeholder ?? createImageUrlProxy(image, '100', '0', 'webp'),
              ...song,
            }}
            isInPlayList={isInPlaylist}
            className="hover:text-enfasisColor group  cursor-pointer rounded-md  p-1 text-sm transition-all duration-300  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            isCurrentSong={isCurrentSong}
          />
          <DownloadButton
            styles="hover:text-enfasisColor focus:ring-enfasisColor focus:ring-offset-Primary-950 group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={song.audio_url}
            title={song.song_title}
            themeId={song.theme_id ?? 0}
            showLabel={false}
          />
          <ShareButton
            className="hover:text-enfasisColor focus:ring-enfasisColor focus:ring-offset-Primary-950 group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
            title={song.song_title}
            text={`Listen ${song.song_title} on AniDev`}
          />
        </MoreOptions>
      </div>

      {isInMusicPlayer && (
        <div
          {...handleProps}
          className="bg-enfasisColor/50 focus:ring-enfasisColor focus:ring-offset-Primary-950 absolute top-1/2 right-0 z-30 flex h-full -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-r-md p-1 shadow-lg backdrop-blur-sm transition-all duration-200 select-none focus:ring-2 focus:ring-offset-2 focus:outline-none active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          tabIndex={0}
          role="button"
          aria-label="Drag to reorder song"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="pointer-events-none h-4 w-4 text-white"
            aria-hidden="true"
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
    </article>
  )
}
