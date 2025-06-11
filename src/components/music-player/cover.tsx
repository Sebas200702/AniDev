import { Picture } from '@components/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'

export const Cover = () => {
  const { currentSong, isPlaying, type, isMinimized } = useMusicPlayerStore()

  if (!currentSong) return null

  let proxyUrl: string
  try {
    isMinimized
      ? (proxyUrl = createImageUrlProxy(
          currentSong.banner_image,
          '400',
          '70',
          'webp'
        ))
      : (proxyUrl = createImageUrlProxy(
          currentSong.banner_image,
          '1920',
          '50',
          'webp'
        ))
  } catch {
    proxyUrl = currentSong.banner_image
  }
  if (!isMinimized && type === 'audio') {
    return (
      <div className="relative h-full aspect-video overflow-hidden">
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
            className="object-cover  h-full  relative aspect-video w-full"
          />
        </Picture>
      </div>
    )
  }

  return (
    <div
      className={`mt-12 relative ${type === 'video' ? 'hidden' : 'block'} flex w-full h-full items-center justify-center p-4`}
    >
      <div className="flex items-center justify-center p-6 disk rounded-full">
        <figure
          className={`relative  rounded-full overflow-hidden shadow-lg border border-gray-100/20 transition-all duration-300 ease-in-out w-32 h-32 ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
        >
          <Picture
            image={createImageUrlProxy(
              currentSong.banner_image,
              '100',
              '0',
              'webp'
            )}
            styles="relative"
          >
            <img
              src={proxyUrl}
              alt={currentSong.song_title}
              className="object-cover w-full h-full rounded-full relative"
            />
          </Picture>
        </figure>
      </div>
    </div>
  )
}
