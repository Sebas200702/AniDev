import { navigate } from 'astro:transitions/client'
import { usePlayback } from '@music/hooks/usePlayBack'
import { usePlaylist } from '@music/hooks/usePlaylist'
import type { AnimeSong } from '@music/types'
import { AddToPlayListButton } from '@shared/components/buttons/add-to-playlist-button'
import { DownloadButton } from '@shared/components/buttons/download-button'
import { ShareButton } from '@shared/components/buttons/share-button'
import { PauseIcon } from '@shared/components/icons/watch/pause-icon'
import { PlayIcon } from '@shared/components/icons/watch/play-icon'
import { Overlay } from '@shared/components/layout/overlay'
import { Picture } from '@shared/components/media/picture'
import { MoreOptions } from '@shared/components/ui/more-options'
import { ColorService } from '@shared/services/color-service'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'

export const MusicDetailCard = ({
  song,
}: {
  song: AnimeSong
}) => {
  const [heights, setHeights] = useState([0, 0, 0, 0])
  const { isPlaying, togglePlay, canPlay } = usePlayback()
  const { isCurrentSong, isInPlaylist } = usePlaylist()

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/artist/${normalizeString(song.artist_name || '')}`)
  }

  const handleAnimeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(
      `/anime/${normalizeString(song.anime?.title || '')}_${song.anime?.id}`
    )
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
      className={` group group border-enfasisColor group relative flex aspect-[100/30] max-h-36 w-full cursor-pointer flex-row items-start overflow-hidden rounded-lg border-l-4 transition-all duration-300 ease-in-out md:gap-2 md:hover:translate-x-1`}
    >
      <a
        href={`/music/${normalizeString(song.song_title ?? 'Unknown Song')}_${song.theme_id}`}
        className="focus:ring-enfasisColor focus:ring-offset-Primary-950 flex h-full w-full rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label={`Play ${song.song_title} by ${song.artist_name || 'Unknown artist'}`}
      >
        <div className="absolute h-full w-full">
          <Picture
            image={song.anime?.banner_image ?? song.anime?.image ?? ''}
            isBanner
            placeholder={song.anime?.banner_image ?? song.anime?.image ?? ''}
            alt={song.song_title ?? 'Unknown Song'}
            styles="h-full w-full object-cover object-center blur-sm "
          />
          <Overlay className="bg-Primary-950/90 h-full w-full overflow-hidden" />
        </div>

        <div className="relative aspect-[225/330] h-full overflow-hidden rounded-l-lg">
          <Picture
            placeholder={song.anime?.image ?? ''}
            image={song.anime?.image ?? ''}
            alt={song.song_title ?? 'Unknown Song'}
            styles="aspect-[225/330] h-full overflow-hidden rounded-l-lg relative"
          />
          {isCurrentSong(song) && (
            <div className="bg-Complementary/30 absolute inset-0 z-10 flex items-center justify-center gap-[3px]">
              {heights.map((height, index) => (
                <div
                  key={index +1}
                  className="bg-enfasisColor w-[3px] rounded-md transition-all duration-150 ease-out group-hover:opacity-0"
                  style={{ height: `${height}px` }}
                />
              ))}
              <button
                className="text-enfasisColor focus:ring-enfasisColor pointer-events-none absolute inset-0 z-20 mx-auto flex h-full w-full cursor-pointer items-center justify-center p-4 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-90 focus:ring-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
                onClick={togglePlay}
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
            className={`absolute top-2  right-2 flex-shrink-0 rounded-full border p-1 text-xs font-medium md:px-2 md:py-1 ${ColorService.getMusicTypeColor(song.type)}  pointer-events-none`}
          >
            {song.type.toUpperCase()}
          </span>
        )}

        <footer className="z-10 flex h-full w-full max-w-[65%] flex-col items-start justify-between px-4 py-2 md:justify-center md:gap-4 md:p-4">
          <div className="flex w-full flex-col  space-x-2 items-center truncate text-pretty ease-in-out select-none md:flex-row">
            <span className="text-m truncate text-white">
              {song.song_title}
            </span>

            {song.artist_name && (
              <span className="text-sxx text-Primary-300 flex w-min flex-row items-end gap-2  truncate md:w-auto">
                By {' '}
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
          {song.anime?.title && (
            <span className="text-sxx text-Primary-300 flex w-full flex-row items-end  gap-2truncate">
              From{' '}
              <button
                onClick={handleAnimeClick}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => handleAnimeClick(e as any))
                }
                tabIndex={0}
                title={`View ${song.anime?.title} details`}
                className="hover:text-enfasisColor ml-1 cursor-pointer truncate rounded transition-all duration-300"
                aria-label={`Go to ${song.anime?.title} details`}
              >
                <strong className="text-sx text-Primary-100 truncate underline-offset-2 hover:underline">
                  {song.anime?.title}
                </strong>
              </button>
            </span>
          )}
        </footer>
      </a>

      <div
        className={`absolute md:bottom-3 pointer-events-auto bottom-2 right-3 z-20`}
      >
        <MoreOptions className="md:flex">
          <AddToPlayListButton
            song={{
              ...song,
            }}
            isInPlayList={isInPlaylist(song)}
            className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            isCurrentSong={isCurrentSong(song)}
          />
          <DownloadButton
            styles="hover:text-enfasisColor focus:ring-enfasisColor focus:ring-offset-Primary-950 group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={''}
            title={song.song_title ?? 'Unknown Song'}
            themeId={song.theme_id ?? 0}
            showLabel={false}
          />
          <ShareButton
            className="hover:text-enfasisColor focus:ring-enfasisColor focus:ring-offset-Primary-950 group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            url={`/music/${normalizeString(song.song_title ?? 'Unknown Song')}_${song.theme_id}`}
            title={song.song_title ?? 'Unknown Song'}
            text={`Listen ${song.song_title ?? 'Unknown Song'} on AniDev`}
          />
        </MoreOptions>
      </div>
    </article>
  )
}
