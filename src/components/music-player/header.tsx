import { useMusicPlayerStore } from '@store/music-player-store'
import { type Ref, useCallback } from 'react'

interface Props {
  playerRef: React.RefObject<HTMLDivElement | null>
}
export const Header = ({ playerRef }: Props) => {
  const {
    isMinimized,
    isDraggingPlayer,
    currentSong,
    setType,
    type,
    setSrc,
    setDragOffset,
    setIsDraggingPlayer,
  } = useMusicPlayerStore()

  if (!currentSong || !playerRef) return
  const handleChangeType = () => {
    if (type === 'audio') {
      setType('video')
      setSrc(currentSong?.video_url)
    } else {
      setType('audio')
      setSrc(currentSong.audio_url)
    }
  }
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.controls-area')
      ) {
        return
      }

      const touch = e.touches[0]

      const rect = playerRef?.current?.getBoundingClientRect()

      if (rect) {
        setDragOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        })
        setIsDraggingPlayer(true)
      }
    },
    [setDragOffset, setIsDraggingPlayer]
  )
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.controls-area')
      ) {
        return
      }

      const rect = playerRef?.current?.getBoundingClientRect()

      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
        setIsDraggingPlayer(true)
      }
    },
    [setDragOffset, setIsDraggingPlayer]
  )
  return (
    <header
      className={`relative flex w-full flex-row gap-2 ${isMinimized ? 'border-none p-2 md:border-b md:border-gray-100/10 md:p-4' : 'p-6'} ${isDraggingPlayer ? 'pointer-events-none' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex w-full flex-row items-center gap-2">
        <div
          className={`bg-Primary-800 ${isMinimized ? 'flex md:hidden' : 'hidden'} animate-spin-slow h-10 w-10 flex-shrink-0 overflow-hidden rounded-full`}
        >
          {currentSong.image && (
            <img
              src={currentSong.image}
              alt={currentSong.anime_title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <span
            className={`line-clamp-1 text-xs ${isMinimized ? 'text-xs font-medium' : 'text-l'} leading-tight text-white`}
          >
            {currentSong.song_title}
          </span>
          <span
            className={`text-Primary-400 line-clamp-1 ${isMinimized ? 'text-xs font-medium' : 'text-s'} leading-tight`}
          >
            {currentSong.artist_name}
          </span>
          <span
            className={`text-enfasisColor line-clamp-1 ${isMinimized ? 'text-xs font-medium' : 'text-m'} leading-tight`}
          >
            {currentSong.anime_title}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            className="text-sxx button-primary h-min cursor-pointer rounded-sm p-4"
            onClick={handleChangeType}
          >
            {type.toUpperCase()}
          </button>
          {isMinimized && (
            <div className="from-enfasisColor/0 to-enfasisColor/20 pointer-events-none absolute inset-0 rounded-t-xl bg-gradient-to-r opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
          )}
        </div>
      </div>
    </header>
  )
}
