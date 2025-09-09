import { Picture } from '@components/media/picture'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { useMemo } from 'react'
import { baseUrl } from '@utils/base-url'

export const Cover = () => {
  const { currentSong, isPlaying, type, isMinimized } = useMusicPlayerStore()

  const proxyUrl = useMemo(() => {
    const source = currentSong?.banner_image ?? currentSong?.image
    if (!source) return `${baseUrl}/placeholder.webp`
    return isMinimized
      ? createImageUrlProxy(source, '300', '75', 'webp')
      : createImageUrlProxy(source, '1920', '75', 'webp')
  }, [isMinimized, currentSong?.banner_image, currentSong?.image])

  if (!currentSong) return null

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
          styles="relative  h-full aspect-video overflow-hidden"
        >
          {proxyUrl && (
            <img
              src={proxyUrl}
              alt={currentSong.song_title}
              className="relative aspect-video h-full w-full object-cover object-center"
            />
          )}
        </Picture>
      </div>
    )
  }

  return (
    <div
      className={`relative ${type === 'video' ? 'hidden' : ''} ${isMinimized ? 'hidden md:flex' : ''} h-full w-full items-center justify-center p-4`}
      id="music-player-cover"
    >
      <div className={` ${isPlaying? '' : 'animation-pause'} disk flex items-center animate-spin-slow justify-center rounded-full p-6`}>

          <Picture
            image={createImageUrlProxy(
              currentSong.banner_image ?? currentSong.image,
              '100',
              '0',
              'webp'
            )}
            styles="relative max-h-32 max-w-32 rounded-full object-cover object-center aspect-square"
          >
            {proxyUrl && (
              <img
                src={proxyUrl}
                alt={currentSong.song_title}
                className="relative h-full w-full rounded-full object-cover object-center"
              />
            )}
          </Picture>

      </div>
    </div>
  )
}
