import { navigate } from 'astro:transitions/client'
import { ClosePlayerButton } from '@music/components/music-player/button/close-player-button'
import { useMediaChange } from '@music/hooks/useMediaChange'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { ExpandIcon } from '@shared/components/icons/common/expand-icon'
import { PauseIcon } from '@shared/components/icons/watch/pause-icon'
import { PlayIcon } from '@shared/components/icons/watch/play-icon'
import { Picture } from '@shared/components/media/picture'
import { MoreOptions } from '@shared/components/ui/more-options'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  playerContainerRef: React.RefObject<HTMLDivElement | null>
}
export const Header = ({ playerContainerRef }: Props) => {
  const {
    isMinimized,
    isDragging,
    currentSong,

    type,

    canPlay,
    isPlaying,
    playerRef,
  } = useMusicPlayerStore()
  const { changeMediaType, changeMediaVersion, versions, selectedVersion } =
    useMediaChange()

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    isPlaying && canPlay
      ? playerRef.current?.pause()
      : playerRef.current?.play()
  }

  if (!currentSong || !playerContainerRef) return

  return (
    <div className="relative">
      <header
        className={`bg-Complementary relative flex w-full flex-row gap-2 ${isMinimized ? 'border-none p-2 md:border-b md:border-gray-100/10 md:p-4' : 'h-28 p-4 md:rounded-b-xl md:p-6'} ${isDragging ? 'pointer-events-none' : ''}`}
      >
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div
            className={`bg-Primary-800 ${isMinimized ? 'flex md:hidden' : 'hidden'} animate-spin-slow h-12 w-12 flex-shrink-0 overflow-hidden rounded-full`}
          >
            {currentSong.anime?.image && (
              <Picture
                image={currentSong.anime.image}
                placeholder={currentSong.anime.image}
                alt={currentSong.anime.title ?? 'Anime Image'}
                styles="h-full w-full object-cover"
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
              {currentSong?.anime?.title}
            </span>
          </div>

          <div className="flex flex-row items-center gap-4">
            {isMinimized && (
              <div className="flex flex-col items-end gap-2">
                <ClosePlayerButton className="hidden md:flex" />
                <button className="text-sxx button-primary mt-6 h-min cursor-pointer rounded-sm p-1 md:mt-0 md:p-4">
                  {type.toUpperCase()}
                </button>
              </div>
            )}

            {!isMinimized && (
              <div className="flex items-center gap-4 md:gap-6">
                {/* Desktop Type Selector - Enhanced */}
                <div className="hidden min-w-[140px] flex-col gap-2 md:flex">
                  <span className="text-Primary-300 text-xs font-medium tracking-wider uppercase">
                    Media Type
                  </span>
                  <div className="relative flex overflow-hidden rounded-lg bg-white/5 p-1 backdrop-blur-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        changeMediaType('audio')
                      }}
                      className={`relative z-10 flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        type === 'audio'
                          ? 'bg-enfasisColor text-white shadow-lg'
                          : 'text-Primary-300 hover:text-white'
                      } `}
                    >
                      Audio
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        changeMediaType('video')
                      }}
                      className={`relative z-10 flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        type === 'video'
                          ? 'bg-enfasisColor text-white shadow-lg'
                          : 'text-Primary-300 hover:text-white'
                      } `}
                    >
                      Video
                    </button>
                  </div>
                </div>
                {/* Mobile Type Toggle */}
                <button className="text-sxx button-primary mt-6 h-min cursor-pointer rounded-sm p-1 md:mt-0 md:hidden md:p-4">
                  {type.toUpperCase()}
                </button>{' '}
                {versions.length > 1 && (
                  <FilterDropdown
                    label="Version"
                    values={[selectedVersion.toString()]}
                    onChange={(value) =>
                      changeMediaVersion(Number.parseInt(value[0]))
                    }
                    options={
                      versions.map((version) => ({
                        label: `V${version.version}`,
                        value: version.version.toString(),
                      })) ?? []
                    }
                    onClear={() => changeMediaVersion(selectedVersion)}
                    styles={`${isMinimized ? 'hidden' : 'flex'} md:flex min-w-[100px]`}
                    singleSelect
                    InputText={false}
                  />
                )}
                {/* Version Selector */}
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
                `/music/${normalizeString(currentSong.song_title ?? '')}_${currentSong.theme_id}`
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
