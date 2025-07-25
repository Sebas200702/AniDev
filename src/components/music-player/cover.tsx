import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'

export const Cover = () => {
  const { currentSong, isPlaying, type, isMinimized } = useMusicPlayerStore()

  if (!currentSong) return null

  let proxyUrl: string
  try {
    isMinimized
      ? (proxyUrl = createImageUrlProxy(
          currentSong.banner_image ?? currentSong.image,
          '400',
          '70',
          'webp'
        ))
      : (proxyUrl = createImageUrlProxy(
          currentSong.banner_image ?? currentSong.image,
          '1920',
          '50',
          'webp'
        ))
  } catch {
    proxyUrl = currentSong.banner_image
  }
  if (!isMinimized && type === 'audio') {
    return (
      <div className="relative aspect-video h-full overflow-hidden">
        <Picture
          image={createImageUrlProxy(
            currentSong.banner_image,
            '100',
            '0',
            'webp'
          )}
          styles="relative  h-full aspect-video"
        >
          <img
            src={proxyUrl}
            alt={currentSong.song_title}
            className="relative aspect-video h-full w-full object-cover"
          />
        </Picture>
      </div>
    )
  }

  return (
    <div
      className={`relative ${type === 'video' ? 'hidden' : ''} ${isMinimized ? 'hidden md:flex' : ''} h-full w-full items-center justify-center p-4`}
      id="music-player-cover"
    >
      <div className="disk flex items-center justify-center rounded-full p-6">
        <figure
          className={`animate-spin-slow relative h-32 w-32 overflow-hidden rounded-full border border-gray-100/20 shadow-lg transition-all duration-300 ease-in-out ${
            isPlaying ? '' : 'animation-pause'
          }`}
        >
          <Picture
            image={createImageUrlProxy(
              currentSong.banner_image ?? currentSong.image,
              '100',
              '0',
              'webp'
            )}
            styles="relative"
          >
            <img
              src={createImageUrlProxy(proxyUrl, '0', '70', 'webp')}
              alt={currentSong.song_title}
              className="relative h-full w-full rounded-full object-cover"
            />
          </Picture>
        </figure>
      </div>
    </div>
  )
}
