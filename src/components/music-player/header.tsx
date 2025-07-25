import { navigate } from 'astro:transitions/client'
import { ExpandIcon } from '@components/icons/expand-icon'
import { PauseIcon } from '@components/icons/pause-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import { useCallback } from 'react'
import { ClosePlayerButton } from './close-player-button'

interface Props {
  playerContainerRef: React.RefObject<HTMLDivElement | null>
}
export const Header = ({ playerContainerRef }: Props) => {
  const {
    isMinimized,
    isDraggingPlayer,
    currentSong,
    setType,
    type,
    setSrc,
    canPlay,
    isPlaying,
    playerRef,
    setDragOffset,
    setIsDraggingPlayer,
    versions,
    versionNumber,
    setVersionNumber,
  } = useMusicPlayerStore()

  if (!currentSong || !playerContainerRef) return
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

      const rect = playerContainerRef?.current?.getBoundingClientRect()

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
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    isPlaying && canPlay
      ? playerRef.current?.pause()
      : playerRef.current?.play()
  }
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

      const rect = playerContainerRef?.current?.getBoundingClientRect()

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
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div
          className={`bg-Primary-800 ${isMinimized ? 'flex md:hidden' : 'hidden'} animate-spin-slow h-12 w-12 flex-shrink-0 overflow-hidden rounded-full`}
        >
          {currentSong.image && (
            <img
              src={createImageUrlProxy(currentSong.image, '0', '70', 'webp')}
              alt={currentSong.anime_title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className={`line-clamp-1 text-xs ${isMinimized ? 'text-xs font-medium' : 'text-l'} leading-tight text-white`}
          >
            {currentSong.song_title}
          </h1>
          <span
            className={`text-Primary-400 line-clamp-1 hidden md:flex ${isMinimized ? 'text-xs font-medium' : 'text-s'} leading-tight`}
          >
            {currentSong.artist_name}
          </span>
          <span
            className={`text-enfasisColor line-clamp-1 ${isMinimized ? 'text-xs font-medium' : 'text-m'} leading-tight`}
          >
            {currentSong.anime_title}
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          {isMinimized && <ClosePlayerButton />}

          <button
            className="text-sxx button-primary h-min cursor-pointer rounded-sm p-1 md:p-4"
            onClick={handleChangeType}
          >
            {type.toUpperCase()}
          </button>

          {versions.length > 1 && !isMinimized && (
            <FilterDropdown
              label="Version"
              values={[versionNumber.toString()]}
              onChange={(value) => setVersionNumber(parseInt(value[0]))}
              options={
                versions.map((version) => ({
                  label: `${version.version}`,
                  value: version.version.toString(),
                })) ?? []
              }
              onClear={() => setVersionNumber(1)}
              styles={`${isMinimized ? 'hidden' : 'flex'} md:flex  min-w-24`}
              singleSelect
              InputText={false}
            />
          )}

          {isMinimized && (
            <>
              <div className="flex flex-row gap-2 md:hidden">
                <button className="p-1" onClick={(e) => handlePlay(e)}>
                  {isPlaying ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/music/${normalizeString(currentSong.song_title)}_${currentSong.theme_id}`
                    )
                  }
                  className="cursor-pointer p-1"
                >
                  <ExpandIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="from-enfasisColor/0 to-enfasisColor/20 pointer-events-none absolute inset-0 rounded-t-xl bg-gradient-to-r opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
