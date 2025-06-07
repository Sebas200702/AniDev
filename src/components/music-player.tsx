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
      className={`bg-Complementary fixed right-10 bottom-36 w-full max-w-xs rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'p-2' : 'p-4'
      } flex flex-col gap-4 border border-gray-700/30`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="bg-enfasisColor h-2 w-2 animate-pulse rounded-full" />
          )}
          {error && <div className="h-2 w-2 rounded-full bg-red-500" />}
        </div>
        <button
          onClick={toggleMinimize}
          className="z-10 p-1 text-gray-400 transition-colors hover:text-white"
        >
          {isMinimized ? (
            <ExpandIcon className="h-4 w-4" />
          ) : (
            <MinimizeIcon className="h-4 w-4" />
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
              className="relative aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <Overlay className="to-Primary-950/80 h-full w-full bg-gradient-to-b from-transparent via-transparent" />

            <div className="absolute right-0 bottom-0 left-0 z-50 flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`rounded p-1 transition-colors ${shuffle ? 'text-enfasisColor bg-enfasisColor/20' : 'text-white/70 hover:text-white'}`}
                  title="Reproducción aleatoria"
                >
                  <RandomIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`rounded p-1 transition-colors ${repeat ? 'text-enfasisColor bg-enfasisColor/20' : 'text-white/70 hover:text-white'}`}
                  title="Repetir"
                >
                  <RepeatIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  className="p-1 text-white/80 transition-colors hover:text-white"
                  disabled={!list.length}
                >
                  <PreviousIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  disabled={isLoading || !!error}
                  className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-1 text-white/80 transition-colors hover:text-white"
                  disabled={!list.length}
                >
                  <NextIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Picture>

          <div className="flex flex-col gap-1">
            <h3
              className="truncate text-lg font-bold text-white"
              title={currentSong.song_title}
            >
              {currentSong.song_title}
            </h3>
            <p
              className="truncate text-sm text-gray-300"
              title={currentSong.artist_name ?? ''}
            >
              {currentSong.artist_name}
            </p>
            <p
              className="truncate text-xs text-gray-400 italic"
              title={currentSong.anime_title}
            >
              {currentSong.anime_title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="min-w-[35px] text-xs text-gray-400">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                onMouseDown={handleSeekStart}
                onMouseUp={handleSeekEnd}
                className="slider h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-600"
                disabled={!duration}
              />
            </div>
            <span className="min-w-[35px] text-xs text-gray-400">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <VolumeIcon className="h-4 w-4 text-gray-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="slider h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-600"
            />
            <span className="min-w-[30px] text-xs text-gray-400">
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
              className="absolute inset-0 h-full w-full rounded object-cover object-center"
            />
            <Overlay className="to-Primary-950/80 h-full w-full bg-gradient-to-b from-transparent via-transparent" />
          </Picture>

          <div className="z-10 min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {currentSong.song_title}
            </p>
            <p className="truncate text-xs text-gray-400">
              {currentSong.artist_name}
            </p>
          </div>
          <button
            onClick={handleTogglePlay}
            disabled={isLoading || !!error}
            className="hover:text-enfasisColor z-10 text-white transition-colors"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && !isMinimized && (
        <div className="rounded bg-red-500/10 p-2 text-center text-xs text-red-400">
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
