import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'
import '@styles/video.css'
import '@styles/player.css'
import { CustomControls } from '@components/music-player/controls'
import { Cover } from '@components/music-player/cover'
import { CustomLayout } from '@components/music-player/custom-layout'
import { Header } from '@components/music-player/header'
import { useMusicPlayerSync } from '@hooks/useMusicPlayerSync'
import { usePlayerBehavior } from '@hooks/usePlayerBehavior'
import { usePlayerDragging } from '@hooks/usePlayerDragging'
import { toast } from '@pheralb/toast'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  Poster,
  Spinner,
  useMediaStore,
} from '@vidstack/react'
import { useEffect, useRef, useState } from 'react'
import { ToastType } from 'types'

export const MusicPlayer = () => {
  const {
    currentSong,
    savedTime,
    isHidden,
    isMinimized,
    isDraggingPlayer,
    position,
    type,
    list,
    currentSongIndex,
    src,
  } = useMusicPlayerStore()

  const player = useRef<MediaPlayerInstance>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const { currentTime, playing, muted, volume, canPlay, duration } =
    useMediaStore(player)

  useMusicPlayerSync(currentTime, playing, player, canPlay, duration)
  usePlayerDragging(playerContainerRef)
  usePlayerBehavior(playerContainerRef)

  const [toastShown, setToastShown] = useState(false)

  useEffect(() => {
    const nextSong = list[currentSongIndex + 1]
    const timeRemaining = duration - currentTime

    if (timeRemaining <= 8 && timeRemaining > 0 && nextSong && !toastShown) {
      const text = () => {
        if (nextSong.artist_name) {
          return `${nextSong.song_title} By ${nextSong.artist_name}`
        }
        return nextSong.song_title
      }
      toast[ToastType.Info]({
        text: `${text()}`,
        description: 'Up Next',
        delayDuration: 7000,
        icon: (
          <img
            src={nextSong.image}
            alt={nextSong.song_title}
            className="relative mr-2 aspect-[225/330] w-10 rounded-sm md:w-12"
          />
        ),
      })
      setToastShown(true)
    }
  }, [currentTime, duration, currentSong, list, currentSongIndex, toastShown])

  useEffect(() => {
    setToastShown(false)
  }, [currentSong?.song_id])

  if (!currentSong) return

  return (
    <article
      ref={playerContainerRef}
      className={`group flex rounded-xl transition-all duration-300 ease-in-out ${isHidden ? 'hidden' : ''} ${isMinimized ? 'from-Complementary/50 to-Complementary/80 fixed z-30 w-full max-w-64 flex-col overflow-hidden border border-gray-100/20 bg-gradient-to-br shadow-lg backdrop-blur-sm sm:max-w-sm md:max-w-80' : 'bg-Complementary/50 mx-4 mt-30 h-min flex-col-reverse md:mx-20 xl:mx-0 xl:mb-20 xl:ml-20 xl:w-[60%]'} ${
        isDraggingPlayer && isMinimized
          ? 'music-player-dragging cursor-grabbing select-none'
          : ''
      }`}
      style={
        isMinimized
          ? {
              bottom: `${position.y}px`,
              right: `${position.x}px`,
            }
          : {}
      }
    >
      <Header playerContainerRef={playerContainerRef} />
      <MediaPlayer
        ref={player}
        src={src ?? ''}
        aspectRatio={isMinimized ? 'auto' : 'video'}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        playsInline
        autoPlay
        title={currentSong.song_title}
        onCanPlay={() => {
          if (player.current && savedTime > 0) {
            player.current.currentTime = savedTime
            player.current.play()
          }
        }}
        poster={createImageUrlProxy(
          currentSong.banner_image ?? currentSong.image,
          '1980',
          '75',
          'webp'
        )}
        className={`flex flex-col ${type === 'audio' && isMinimized && 'h-0 md:h-auto'} `}
      >
        <MediaProvider
          className={`${type === 'audio' && isMinimized ? 'mt-12 hidden md:flex' : 'aspect-video'}`}
        >
          {type === 'audio' && !isMinimized && (
            <Poster className="absolute aspect-[16/9] h-full w-full object-cover object-center" />
          )}
          {type === 'audio' && isMinimized && (
            <div className="absolute h-full w-full">
              <Cover />
            </div>
          )}
          <Poster className="vds-poster" />

          {isMinimized && (
            <div className="vds-buffering-indicator">
              <Spinner.Root className="vds-buffering-spinner text-enfasisColor">
                <Spinner.Track className="vds-buffering-track" />
                <Spinner.TrackFill className="vds-buffering-track-fill" />
              </Spinner.Root>
            </div>
          )}
        </MediaProvider>

        {!isMinimized ? (
          <CustomLayout />
        ) : (
          <CustomControls volume={volume} muted={muted} />
        )}
      </MediaPlayer>
    </article>
  )
}
