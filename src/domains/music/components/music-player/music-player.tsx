import { useMusicPlayerSync } from '@music/hooks/useMusicPlayerSync'
import { usePlayerBehavior } from '@music/hooks/usePlayerBehavior'
import { usePlayerDragging } from '@music/hooks/usePlayerDragging'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { ToastType } from '@shared/types'
import { createImageUrlProxy } from '@shared/utils/create-image-url-proxy'
import {
  type MediaPlayerInstance,
  Spinner,
  useMediaStore,
} from '@vidstack/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Cover } from '@music/components/music-player/music-info/cover'
import { Header } from '@music/components/music-player/music-info/header'
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { CustomControls } from 'domains/music/components/music-player/controls'
import { CustomLayout } from 'domains/music/components/music-player/custom-layout'

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
    isPlaying,
  } = useMusicPlayerStore()

  const player = useRef<MediaPlayerInstance>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const { currentTime, playing, muted, volume, duration, canPlay } =
    useMediaStore(player)

  useMusicPlayerSync(currentTime, playing, player, canPlay, duration)
  usePlayerDragging(playerContainerRef)
  usePlayerBehavior(playerContainerRef)

  const [toastShown, setToastShown] = useState(false)

  useEffect(() => {
    const loadCSS = async () => {
      await Promise.all([
        import('@vidstack/react/player/styles/default/theme.css'),
        import('@vidstack/react/player/styles/default/layouts/audio.css'),
        import('@music/styles/video.css'),
        import('@music/styles/player.css'),
      ])
    }
    loadCSS()
  }, [])

  useEffect(() => {
    const nextSong = list[currentSongIndex + 1]
    const timeRemaining = duration - currentTime

    if (
      timeRemaining <= 8 &&
      timeRemaining > 0 &&
      nextSong &&
      !toastShown &&
      isPlaying
    ) {
      const text = () => {
        if (nextSong.artist_name) {
          return `${nextSong.song_title} By ${nextSong.artist_name}`
        }
        return nextSong.song_title
      }
      import('@pheralb/toast').then((module) => {
        module.toast[ToastType.Info]({
          text: `${text()}`,
          description: 'Up Next',
          delayDuration: 7000,
          icon: (
            <img
              src={createImageUrlProxy(nextSong.image, '0', '70', 'webp')}
              alt={nextSong.song_title}
              className="relative mr-2 aspect-[225/330] w-10 rounded-sm md:w-12"
            />
          ),
        })
      })
      setToastShown(true)
    }
  }, [
    currentTime,
    duration,
    currentSong,
    list,
    currentSongIndex,
    toastShown,
    isPlaying,
  ])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToastShown(false)
    }, 8000)
    return () => clearTimeout(timeout)
  }, [currentSong?.song_id])

  if (!currentSong) return null

  return (
    <AnimatePresence>
      <motion.article
        ref={playerContainerRef}
        animate={{
          opacity: isHidden ? 0 : 1,
          y: isHidden ? 30 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`group flex rounded-xl ${
          isMinimized
            ? 'from-Complementary/50 to-Complementary/80 animate-pulsePlayer fixed z-50 w-full max-w-64 flex-col overflow-hidden border border-gray-100/20 bg-gradient-to-br shadow-lg backdrop-blur-sm sm:max-w-sm md:max-w-80'
            : 'bg-Complementary/50 w-full flex-col-reverse'
        } ${isDraggingPlayer && isMinimized ? 'music-player-dragging cursor-grabbing select-none' : ''} `}
        style={
          isMinimized
            ? { bottom: `${position.y}px`, right: `${position.x}px` }
            : {}
        }
      >
        <Header playerContainerRef={playerContainerRef} />

        <MediaPlayer
          ref={player}
          src={src || undefined}
          aspectRatio={isMinimized ? 'auto' : 'video'}
          viewType="video"
          streamType="on-demand"
          logLevel="silent"
          playsInline
          autoPlay
          title={currentSong.song_title}
          onCanPlay={() => {
            if (player.current && savedTime > 0) {
              player.current.currentTime = savedTime
            }
          }}
          poster={createImageUrlProxy(
            currentSong.banner_image ?? currentSong.image,
            isMinimized ? '300' : '1980',
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
      </motion.article>
    </AnimatePresence>
  )
}
