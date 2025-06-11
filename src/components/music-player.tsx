import { Picture } from '@components/picture'

import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import { useCallback, useEffect, useRef, useState } from 'react'

export const MusicPlayer = () => {
  const {
    list,
    isPlaying,
    currentSong,

    setIsPlaying,
    setCurrentTime,
    setCurrentSong,
    type,

    setDuration,
    setVolume,
    setIsLoading,
    volume,
    duration,
    isLoading,
    repeat,
    shuffle,

    isDragging,

    error,
    setError,
  } = useMusicPlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [savedTime, setSavedTime] = useState<number>(0)
  const [isChangingFormat, setIsChangingFormat] = useState(false)

  const getMediaRef = () => {
    return type === 'video' ? videoRef.current : audioRef.current
  }

  useEffect(() => {
    const media = getMediaRef()
    if (!media) return

    const onTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(media.currentTime)
      }
    }

    const onLoadStart = () => setIsLoading(true)

    const onCanPlay = () => {
      setIsLoading(false)
      setError(null)
      setDuration(media.duration)

      if (isChangingFormat && savedTime > 0) {
        media.currentTime = savedTime
        setCurrentTime(savedTime)
        setIsChangingFormat(false)
        setSavedTime(0)

        if (isPlaying) {
          media.play().catch(console.error)
        }
      }
    }

    const onError = () => {
      setIsLoading(false)
      setError('Error al cargar el media')
      setIsPlaying(false)
    }

    const onEnded = () => {
      if (repeat) {
        media.currentTime = 0
        media.play()
      } else {
        handleNext()
      }
    }

    const onVolumeChange = () => setVolume(media.volume)

    media.addEventListener('timeupdate', onTimeUpdate)
    media.addEventListener('loadstart', onLoadStart)
    media.addEventListener('canplay', onCanPlay)
    media.addEventListener('error', onError)
    media.addEventListener('ended', onEnded)
    media.addEventListener('volumechange', onVolumeChange)

    return () => {
      media.removeEventListener('timeupdate', onTimeUpdate)
      media.removeEventListener('loadstart', onLoadStart)
      media.removeEventListener('canplay', onCanPlay)
      media.removeEventListener('error', onError)
      media.removeEventListener('ended', onEnded)
      media.removeEventListener('volumechange', onVolumeChange)
    }
  }, [
    repeat,
    isDragging,
    setCurrentTime,
    type,
    isChangingFormat,
    savedTime,
    isPlaying,
  ])

  useEffect(() => {
    const media = getMediaRef()
    if (!media || !currentSong) return

    const playMedia = async () => {
      try {
        setIsLoading(true)
        await media.play()
        setError(null)
      } catch (err) {
        console.error('Playback failed:', err)
        setError('Error al reproducir')
        setIsPlaying(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (isChangingFormat) return

    if (isPlaying) {
      playMedia()
    } else {
      media.pause()
    }
  }, [isPlaying, currentSong, type, isChangingFormat])

  useEffect(() => {
    const media = getMediaRef()
    if (media) {
      media.volume = volume
    }
  }, [volume, type])

  const handleNext = useCallback(() => {
    if (!list.length || !currentSong) return

    let nextIdx: number
    if (shuffle) {
      do {
        nextIdx = Math.floor(Math.random() * list.length)
      } while (
        nextIdx ===
          list.findIndex((song) => song.song_id === currentSong.song_id) &&
        list.length > 1
      )
    } else {
      const idx = list.findIndex((song) => song.song_id === currentSong.song_id)
      nextIdx = (idx + 1) % list.length
    }

    setCurrentSong(list[nextIdx])
    setIsPlaying(true)
  }, [list, currentSong, shuffle, setCurrentSong, setIsPlaying])

  if (!currentSong) return null

  let proxyUrl: string
  try {
    proxyUrl = createImageUrlProxy(currentSong.image, '720', '50', 'webp')
  } catch {
    proxyUrl = currentSong.image
  }

  return (
    <article className="bg-Complementary border-1 border-enfasisColor/30 absolute bottom-40 right-10 z-20 max-w-80 w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out transform">
      <figure
        className={`w-48 h-48 mx-auto my-4 aspect-square relative rounded-full overflow-hidden ${
          isPlaying ? 'animate-spin-slow' : ''
        }`}
      >
        <Picture
          image={createImageUrlProxy(
            currentSong.placeholder,
            '100',
            '0',
            'webp'
          )}
          styles="relative"
        >
          <img
            src={proxyUrl}
            alt={currentSong.song_title}
            className="object-cover relative w-full h-full rounded-full"
          />
        </Picture>
      </figure>
    </article>
  )
}
