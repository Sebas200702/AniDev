import { useMusicPlayerStore } from '@store/music-player-store'
import { MusicIcon } from 'domains/shared/components/icons/music-icon'
import { Picture } from 'domains/shared/components/media/picture'

export const RestorePlayerButton = () => {
  const { isHidden, setIsHidden, isPlaying, currentSong } =
    useMusicPlayerStore()
  const handleClick = () => {
    setIsHidden(false)
  }

  if (!isHidden || !currentSong) return null

  return (
    <button
      onClick={handleClick}
      id="restore-player-button"
      className={`bg-enfasisColor border-Primary-900/10 group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm`}
      title={`Playing ${currentSong?.song_title}`}
    >
      <MusicIcon className="h-5 w-5" />
      <div
        className={`bg-Complementary/60 absolute z-50 hidden min-w-72 translate-y-full gap-3 rounded-xl border border-gray-100/10 p-3 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out group-hover:flex`}
      >
        <Picture
          placeholder={currentSong.placeholder}
          styles={`relative max-h-12 max-w-12 overflow-hidden rounded-full ${isPlaying ? 'animate-spin-slow' : ''}`}
          alt={currentSong?.song_title}
          image={currentSong.image}
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">{currentSong?.song_title}</p>
          <p className="text-enfasisColor/90 text-xs">
            {currentSong?.anime_title}
          </p>
        </div>
      </div>
    </button>
  )
}
