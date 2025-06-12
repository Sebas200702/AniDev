import { MusicIcon } from '@components/icons/music-icon'
import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import { useState } from 'react'

export const RestorePlayerButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const { isHidden, setIsHidden, isPlaying, currentSong } =
    useMusicPlayerStore()
  const handleClick = () => {
    setIsHidden(false)
    setIsHovered(false)
  }

  if (!isHidden || !currentSong) return null

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="restore-player-button"
        className={`w-10 h-10 rounded-full bg-enfasisColor  ${isPlaying ? 'animate-pulse' : ''} backdrop-blur-sm border border-Primary-900/10 flex items-center justify-center `}
        title={`Playing ${currentSong?.song_title}`}
      >
        <MusicIcon className="w-5 h-5" />
      </button>
      <div
        className={`absolute bg-Complementary/50 backdrop-blur-lg rounded-xl border border-gray-100/10 shadow-2xl p-3 z-50 translate-y-full flex gap-3 min-w-72 items-center justify-center ${isHovered ? 'opacity-100 translate-y-2' : 'opacity-0 translate-y-0 pointer-events-none'} transition-all duration-300 ease-out`}
      >
        <figure
          className={`max-w-12 max-h-12 rounded-full overflow-hidden relative ${isPlaying ? 'animate-spin-slow' : ''}`}
        >
          <Picture image={currentSong.placeholder} styles="relative">
            <img
              src={currentSong.image}
              alt={currentSong?.song_title}
              className="relative h-full aspect-square rounded-lg object-cover"
            />
          </Picture>
        </figure>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">{currentSong?.song_title}</p>
          <p className="text-xs text-enfasisColor/90">
            {currentSong?.anime_title}
          </p>
        </div>
      </div>
    </>
  )
}
