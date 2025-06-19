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
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  Poster,
  Spinner,
  useMediaStore,
} from '@vidstack/react'
import { useRef } from 'react'

export const MusicPlayer = () => {
  const {
    currentSong,
    savedTime,
    isHidden,
    isMinimized,
    isDraggingPlayer,
    position,
    type,
    src,
  } = useMusicPlayerStore()

  const player = useRef<MediaPlayerInstance>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const { currentTime, playing, muted, volume, canPlay } = useMediaStore(player)

  useMusicPlayerSync(currentTime, playing, player, canPlay)
  usePlayerDragging(playerContainerRef)
  usePlayerBehavior(playerContainerRef)

  if (!currentSong) return

  return (
    <article
      ref={playerContainerRef}
      className={`group flex rounded-xl transition-all duration-300 ease-in-out ${isHidden ? 'hidden' : ''} ${isMinimized ? 'from-Complementary/50 to-Complementary/80 fixed z-30 w-full max-w-60 flex-col overflow-hidden border border-gray-100/20 bg-gradient-to-br shadow-lg backdrop-blur-sm sm:max-w-sm md:max-w-80' : 'bg-Complementary/50 mx-4 mt-30 h-min flex-col-reverse md:mx-20 xl:mb-20 xl:w-[65%]'} ${
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
      <Header playerRef={playerContainerRef} />
      <MediaPlayer
        ref={player}
        src={src ?? ''}
        aspectRatio={isMinimized ? 'auto' : 'video'}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        playsInline
        title={currentSong.song_title}
        onCanPlay={() => {
          if (player.current && savedTime > 0) {
            player.current.currentTime = savedTime
            player.current.play()
          }
        }}
        poster={createImageUrlProxy(
          currentSong.banner_image ?? '',
          '1080',
          '70',
          'webp'
        )}
        className={`flex flex-col`}
      >
        <MediaProvider
          className={`${type === 'audio' && isMinimized ? 'mt-12' : 'aspect-video'}`}
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
