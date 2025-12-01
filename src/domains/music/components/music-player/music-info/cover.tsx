import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { Picture } from '@shared/components/media/picture'

export const Cover = () => {
  const { currentSong, isPlaying, type, isMinimized } = useMusicPlayerStore()

  if (!currentSong) return null

  if (!isMinimized && type === 'audio') {
    return (
      <div className="relative aspect-video h-full overflow-hidden">
        <Picture
          image={
            currentSong.anime?.banner_image ?? currentSong.anime?.image ?? ''
          }
          styles="relative  h-full aspect-video overflow-hidden"
          alt={currentSong.song_title ?? 'Unknown Song'}
          placeholder={
            currentSong.anime?.banner_image ?? currentSong.anime?.image ?? ''
          }
        />
      </div>
    )
  }

  return (
    <div
      className={`relative ${type === 'video' ? 'hidden' : ''} ${isMinimized ? 'hidden md:flex' : ''} h-full w-full items-center justify-center p-4`}
      id="music-player-cover"
    >
      <div
        className={` ${isPlaying ? '' : 'animation-pause'} disk animate-spin-slow flex items-center justify-center rounded-full p-6`}
      >
        <Picture
          image={
            currentSong.anime?.banner_image ?? currentSong.anime?.image ?? ''
          }
          styles="relative max-h-32 max-w-32 rounded-full object-cover object-center aspect-square"
          alt={currentSong.song_title ?? 'Unknown Song'}
          placeholder={
            currentSong.anime?.banner_image ?? currentSong.anime?.image ?? ''
          }
        />
      </div>
    </div>
  )
}
