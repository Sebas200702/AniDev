import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { ExpandIcon } from '@icons/expand-icon'
import { MinimizeIcon } from '@icons/minimize-icon'
import { NextIcon } from '@icons/next-icon'
import { PauseIcon } from '@icons/pause-icon'
import { PlayIcon } from '@icons/play-icon'
import { PreviousIcon } from '@icons/previous-icon'
import { RandomIcon } from '@icons/random-icon'
import { RepeatIcon } from '@icons/repeat-icon'
import { VolumeIcon } from '@icons/volume-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import { useCallback, useEffect, useRef, useState } from 'react'

export const MusicPlayer = () => {
  const {
    list,
    isPlaying,
    currentSong,
    currentTime,
    setIsPlaying,
    setCurrentTime,
    setCurrentSong,
    type,
    setType,
  } = useMusicPlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [repeat, setRepeat] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Mejora en la gestión de eventos del audio
  useEffect(() => {
    const media = audioRef.current
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
      setDuration(media.duration || 0)
    }

    const onError = () => {
      setIsLoading(false)
      setError('Error al cargar el audio')
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

    // Event listeners
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
  }, [repeat, isDragging, setCurrentTime])

  // Mejora en el control de reproducción
  useEffect(() => {
    const media = audioRef.current
    if (!media || !currentSong) return

    const playAudio = async () => {
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

    if (isPlaying) {
      playAudio()
    } else {
      media.pause()
    }
  }, [isPlaying, currentSong])

  // Control de volumen
  useEffect(() => {
    const media = audioRef.current
    if (media) {
      media.volume = volume
    }
  }, [volume])

  const handleTogglePlay = useCallback(() => {
    if (error) return
    setIsPlaying(!isPlaying)
  }, [isPlaying, error, setIsPlaying])

  const handleNext = useCallback(() => {
    if (!list.length || !currentSong) return

    let nextIdx: number
    if (shuffle) {
      // Reproducción aleatoria
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

  const handlePrevious = useCallback(() => {
    if (!list.length || !currentSong) return

    const idx = list.findIndex((song) => song.song_id === currentSong.song_id)
    const prevIdx = idx === 0 ? list.length - 1 : idx - 1

    setCurrentSong(list[prevIdx])
    setIsPlaying(true)
  }, [list, currentSong, setCurrentSong, setIsPlaying])

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value)
      if (audioRef.current) {
        audioRef.current.currentTime = time
      }
      setCurrentTime(time)
    },
    [setCurrentTime]
  )

  const handleSeekStart = () => setIsDragging(true)
  const handleSeekEnd = () => setIsDragging(false)

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number(e.target.value)
      setVolume(newVolume)
    },
    []
  )

  const toggleRepeat = () => setRepeat((prev) => !prev)
  const toggleShuffle = () => setShuffle((prev) => !prev)
  const toggleMinimize = () => setIsMinimized((prev) => !prev)

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  if (!currentSong) return null

  let proxyUrl: string
  try {
    proxyUrl = createImageUrlProxy(currentSong.image, '720', '50', 'webp')
  } catch {
    proxyUrl = currentSong.image
  }

  return (
    <div
      className={`fixed w-full max-w-xs bottom-36 right-10 bg-Complementary rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'p-2' : 'p-4'
      } gap-4 flex flex-col border border-gray-700/30 `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="w-2 h-2 bg-enfasisColor rounded-full animate-pulse" />
          )}
          {error && <div className="w-2 h-2 bg-red-500 rounded-full" />}
        </div>
        <button
          onClick={toggleMinimize}
          className="text-gray-400 hover:text-white transition-colors p-1 z-10"
        >
          {isMinimized ? (
            <ExpandIcon className="w-4 h-4" />
          ) : (
            <MinimizeIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isMinimized && (
        <>
          <Picture
            image={createImageUrlProxy(currentSong.image, '100', '0', 'webp')}
            styles="aspect-video w-full h-full relative overflow-hidden rounded-md"
          >
            <img
              src={proxyUrl}
              alt={currentSong.song_title}
              className="aspect-video w-full object-cover relative transition-transform duration-300 hover:scale-105"
            />
            <Overlay className="bg-gradient-to-b from-transparent via-transparent to-Primary-950/80 h-full w-full" />

            <div className="absolute bottom-0 left-0 right-0 p-4 z-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-1 rounded transition-colors ${shuffle ? 'text-enfasisColor bg-enfasisColor/20' : 'text-white/70 hover:text-white'}`}
                  title="Reproducción aleatoria"
                >
                  <RandomIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-1 rounded transition-colors ${repeat ? 'text-enfasisColor bg-enfasisColor/20' : 'text-white/70 hover:text-white'}`}
                  title="Repetir"
                >
                  <RepeatIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  disabled={!list.length}
                >
                  <PreviousIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  disabled={isLoading || !!error}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  disabled={!list.length}
                >
                  <NextIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Picture>

          <div className="flex flex-col gap-1">
            <h3
              className="text-lg font-bold text-white truncate"
              title={currentSong.song_title}
            >
              {currentSong.song_title}
            </h3>
            <p
              className="text-sm text-gray-300 truncate"
              title={currentSong.artist_name ?? ''}
            >
              {currentSong.artist_name}
            </p>
            <p
              className="text-xs text-gray-400 italic truncate"
              title={currentSong.anime_title}
            >
              {currentSong.anime_title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 min-w-[35px]">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                onMouseDown={handleSeekStart}
                onMouseUp={handleSeekEnd}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                disabled={!duration}
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[35px]">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <VolumeIcon className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-400 min-w-[30px]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="flex items-center gap-3">
          <Picture
            image={createImageUrlProxy(currentSong.image, '100', '0', 'webp')}
            styles="h-full object-cover rounded w-full inset-0 object-center absolute"
          >
            <img
              src={createImageUrlProxy(currentSong.image, '300', '70', 'webp')}
              alt={currentSong.song_title}
              className="h-full object-cover rounded w-full inset-0 object-center absolute"
            />
            <Overlay className="bg-gradient-to-b from-transparent via-transparent to-Primary-950/80 h-full w-full" />
          </Picture>

          <div className="flex-1 min-w-0 z-10">
            <p className="text-sm font-medium text-white truncate">
              {currentSong.song_title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentSong.artist_name}
            </p>
          </div>
          <button
            onClick={handleTogglePlay}
            disabled={isLoading || !!error}
            className="text-white hover:text-enfasisColor transition-colors z-10"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && !isMinimized && (
        <div className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded">
          {error}
        </div>
      )}

      {type === 'audio' ? (
        // biome-ignore lint/a11y/useMediaCaption: <explanation>
        <audio ref={audioRef} src={currentSong.audio_url} preload="metadata" />
      ) : (
        // biome-ignore lint/a11y/useMediaCaption: <explanation>
        <video
          ref={audioRef as any}
          src={currentSong.audio_url}
          preload="metadata"
        />
      )}
    </div>
  )
}
