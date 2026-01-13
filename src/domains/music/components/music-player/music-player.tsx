import { Cover } from '@music/components/music-player/music-info/cover'
import { Header } from '@music/components/music-player/music-info/header'
import { DragHandle, DraggablePlayer } from '@music/hooks/useDragPlayer'
import { useFetchMusic } from '@music/hooks/useFetchMusic'
import { usePlayerBehavior } from '@music/hooks/usePlayerBehavior'
import { usePlayerSync } from '@music/hooks/usePlayerSync'
import { useThemeId } from '@music/hooks/useThemeId'
import { useUrlSync } from '@music/hooks/useUrlSync'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { createImageUrlProxy } from '@shared/utils/create-image-url-proxy'
import {
  type MediaPlayerInstance,
  Spinner,
  useMediaStore,
} from '@vidstack/react'
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { CustomControls } from 'domains/music/components/music-player/controls'
import { CustomLayout } from 'domains/music/components/music-player/custom-layout'
import { useEffect, useRef } from 'react'
export const MusicPlayer = () => {
  const {
    currentSong,
    isHidden,
    isMinimized,
    isDragging,
    type,
    src,
    shouldAnimateOnRestore,
  } = useMusicPlayerStore()
  const themeId = useThemeId()

  useFetchMusic({ theme_id: themeId })

  const player = useRef<MediaPlayerInstance>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const { currentTime, playing, muted, volume, duration, canPlay } =
    useMediaStore(player)

  usePlayerSync({ playing, time: currentTime, duration, canPlay, player })
  useUrlSync()

  usePlayerBehavior(playerContainerRef)

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
  const getAnimationClass = () => {
    if (shouldAnimateOnRestore && isHidden) return 'animate-fade-out-down'
    if (shouldAnimateOnRestore && !isHidden) return 'animate-fade-in-up'
    if (isMinimized) return 'hidden'
    return ''
  }

  if (!currentSong) return null

  return (
    <DraggablePlayer>
      <article
        ref={playerContainerRef}
        className={`group flex rounded-xl ${getAnimationClass()} ${
          isMinimized
            ? 'from-Complementary/50 to-Complementary/80 animate-pulsePlayer z-50 w-full max-w-64 flex-col overflow-hidden border border-gray-100/20 bg-gradient-to-br shadow-lg backdrop-blur-sm sm:max-w-sm md:max-w-80'
            : 'bg-Complementary/50 w-full flex-col-reverse'
        } ${isDragging && isMinimized ? 'music-player-dragging cursor-grabbing select-none' : ''} `}
      >
        <DragHandle>
          <Header playerContainerRef={playerContainerRef} />
        </DragHandle>

        <MediaPlayer
          ref={player}
          src={src ?? undefined}
          aspectRatio={isMinimized ? 'auto' : 'video'}
          autoPlay
          viewType="video"
          streamType="on-demand"
          logLevel="error"
          title={currentSong.song_title ?? 'Unknown Song'}
          poster={createImageUrlProxy(
            currentSong.anime?.banner_image ?? currentSong.anime?.image ?? '',
            isMinimized ? '600' : '1980',
            '75',
            'webp'
          )}
          className={`flex flex-col ${type === 'audio' && isMinimized && 'h-0 md:h-auto'} `}
        >
          <MediaProvider
            className={`${type === 'audio' && isMinimized ? 'hidden py-6 md:flex' : 'aspect-video'} h-full w-full`}
          >
            {type === 'audio' && !isMinimized && (
              <Poster className="absolute aspect-[16/9] h-full w-full object-cover object-center" />
            )}
            {type === 'audio' && isMinimized && <Cover />}

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

          {isMinimized ? (
            <CustomControls volume={volume} muted={muted} />
          ) : (
            <CustomLayout />
          )}
        </MediaPlayer>
      </article>
    </DraggablePlayer>
  )
}
