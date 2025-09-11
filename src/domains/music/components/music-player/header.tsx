import { navigate } from 'astro:transitions/client'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import { FilterDropdown } from 'domains/search/components/filters/filter-dropdown'
import { ExpandIcon } from 'domains/shared/components/icons/expand-icon'
import { PauseIcon } from 'domains/shared/components/icons/pause-icon'
import { PlayIcon } from 'domains/shared/components/icons/play-icon'
import { MoreOptions } from 'domains/shared/components/more-options'
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

  return (
    <div className="relative">
      <header
        className={`bg-Complementary relative flex w-full flex-row gap-2 ${isMinimized ? 'border-none p-2 md:border-b md:border-gray-100/10 md:p-4' : 'h-28 p-4 md:rounded-b-xl md:p-6'} ${isDraggingPlayer ? 'pointer-events-none' : ''}`}
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

          <div className="flex flex-col gap-4">
            <span
              className={`line-clamp-1 space-x-3 ${isMinimized ? 'text-s font-medium' : 'text-l'} leading-tight text-white`}
            >
              {currentSong.song_title}
              {currentSong.artist_name && (
                <strong className="text-Primary-400 mx-1 text-xs">By</strong>
              )}
              {currentSong.artist_name}
            </span>

            <span
              className={`text-enfasisColor line-clamp-1 ${isMinimized ? 'text-xs font-medium' : 'text-m'} leading-tight`}
            >
              <strong className="text-Primary-400 mx-1 text-xs">From</strong>
              {currentSong.anime_title}
            </span>
          </div>

          <div className="flex flex-row items-center gap-4">
            {isMinimized && (
              <div className="flex flex-col items-end gap-2">
                <ClosePlayerButton className="hidden md:flex" />
                <button
                  className="text-sxx button-primary mt-6 h-min cursor-pointer rounded-sm p-1 md:mt-0 md:p-4"
                  onClick={handleChangeType}
                >
                  {type.toUpperCase()}
                </button>
              </div>
            )}

            {!isMinimized && (
              <div className="flex flex-row items-center justify-end gap-4 md:w-60 md:gap-8 xl:w-80">
                <div className="hidden w-full max-w-40 flex-col gap-2 md:flex">
                  <span className="text-Primary-200 text-s">Select Type</span>
                  <div className="flex w-full -skew-x-8 transform flex-row overflow-hidden rounded-sm">
                    <button
                      title={`Select Audio Type`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setType('audio')
                      }}
                      className={`text-Primary-100 text-m flex w-full cursor-pointer items-center justify-center py-1.5 transition-colors ${
                        type === 'audio'
                          ? 'bg-enfasisColor/80'
                          : 'bg-enfasisColor/20 hover:bg-enfasisColor/40'
                      }`}
                    >
                      <span className="flex skew-x-8">Audio</span>
                    </button>
                    <button
                      title={`Select Video Type`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setType('video')
                        setSrc(currentSong?.video_url)
                      }}
                      className={`text-Primary-100 text-m flex w-full cursor-pointer items-center justify-center py-1.5 transition-colors ${
                        type === 'video'
                          ? 'bg-enfasisColor/80'
                          : 'bg-enfasisColor/20 hover:bg-enfasisColor/40'
                      }`}
                    >
                      <span className="flex skew-x-8">Video</span>
                    </button>
                  </div>
                </div>
                <button
                  className="text-sx button-primary mt-6 flex h-min cursor-pointer rounded-sm p-1 md:mt-0 md:hidden md:p-4"
                  onClick={handleChangeType}
                >
                  {type.toUpperCase()}
                </button>
                {versions.length > 1 && (
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
                    styles={`${isMinimized ? 'hidden' : 'flex'} md:flex  md:min-w-24  min-w-16`}
                    singleSelect
                    InputText={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className={`from-enfasisColor/0 to-enfasisColor/20 pointer-events-none absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ease-in-out ${isMinimized ? 'rounded-t-xl opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
        />
      </header>

      {isMinimized && (
        <MoreOptions className="absolute top-2 right-2 md:hidden">
          <ClosePlayerButton />
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
        </MoreOptions>
      )}
    </div>
  )
}
