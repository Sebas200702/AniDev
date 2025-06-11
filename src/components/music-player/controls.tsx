import { NextIcon } from '@icons/next-icon'
import { PauseIcon } from '@icons/pause-icon'
import { PlayIcon } from '@icons/play-icon'
import { PreviousIcon } from '@icons/previous-icon'
import { RandomIcon } from '@icons/random-icon'
import { RepeatIcon } from '@icons/repeat-icon'
import { TrailerIcon } from '@icons/trailer-icon'
import { VolumeIcon } from '@icons/volume-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useCallback } from 'react'

interface ControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>
  videoRef: React.RefObject<HTMLVideoElement>
  currentTime: number
  duration: number
  setSavedTime: (time: number) => void
  setIsChangingFormat: (changing: boolean) => void
}

export const Controls = ({
  audioRef,
  videoRef,
  currentTime,
  duration,
  setSavedTime,
  setIsChangingFormat,
}: ControlsProps) => {
  const {
    list,
    isPlaying,
    currentSong,
    setIsPlaying,
    setCurrentTime,
    setCurrentSong,
    type,
    setType,
    setVolume,
    volume,
    repeat,
    shuffle,
    setRepeat,
    setShuffle,
    isDragging,
    setIsDragging,
    error,
    isVolumeDragging,
    setIsVolumeDragging,
    dragPosition,
    setDragPosition,
  } = useMusicPlayerStore()

  const getMediaRef = () => {
    return type === 'video' ? videoRef.current : audioRef.current
  }

  const handleTogglePlay = useCallback(() => {
    if (error) return
    setIsPlaying(!isPlaying)
  }, [isPlaying, error, setIsPlaying])

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

      if (isDragging) {
        setDragPosition(time)
      } else {
        const media = getMediaRef()
        if (media) {
          media.currentTime = time
        }
        setCurrentTime(time)
      }
    },
    [isDragging, setCurrentTime, type, setDragPosition]
  )

  const handleSeekStart = () => {
    setIsDragging(true)
    setDragPosition(currentTime)

    if (isPlaying) {
      const media = getMediaRef()
      if (media) {
        media.pause()
      }
    }
  }

  const handleSeekEnd = () => {
    const media = getMediaRef()

    if (media) {
      media.currentTime = dragPosition
    }
    setCurrentTime(dragPosition)

    setIsDragging(false)

    if (isPlaying && media) {
      requestAnimationFrame(() => {
        media.play().catch((err) => {
          console.error('Error al reanudar reproducción:', err)
        })
      })
    }
  }

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number(e.target.value)
      setVolume(newVolume)
    },
    [setVolume]
  )

  const handleVolumeStart = () => setIsVolumeDragging(true)
  const handleVolumeEnd = () => setIsVolumeDragging(false)

  const toggleRepeat = () => setRepeat(!repeat)
  const toggleShuffle = () => setShuffle(!shuffle)

  const handleToggleFormat = () => {
    const currentMedia = getMediaRef()

    if (currentMedia) {
      const currentTime = currentMedia.currentTime
      const wasPlaying = !currentMedia.paused

      currentMedia.pause()

      setSavedTime(currentTime)
      setIsChangingFormat(true)

      const newType = type === 'audio' ? 'video' : 'audio'
      setType(newType)

      if (wasPlaying) {
        setIsPlaying(true)
      }
    } else {
      setType(type === 'audio' ? 'video' : 'audio')
    }
  }

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center space-x-3 text-sm">
        <span className="text-gray-400 min-w-[3rem] text-sxx">
          {formatTime(isDragging ? dragPosition : currentTime)}
        </span>
        <div className={`flex-1 group ${isDragging ? 'dragging' : ''}`}>
          <div className="relative h-4 flex items-center">
            <div className="w-full h-1 bg-gray-100/10 rounded-full" />

            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-enfasisColor rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${((isDragging ? dragPosition : currentTime) / duration) * 100 || 0}%`,
              }}
            />

            {isDragging && (
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/60 rounded-full"
                style={{ left: `${(dragPosition / duration) * 100 || 0}%` }}
              />
            )}

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={isDragging ? dragPosition : currentTime}
              onChange={handleSeek}
              onInput={handleSeek}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              className={`absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer slider-minimal ${
                isDragging ? 'dragging-active' : ''
              }`}
            />
          </div>
        </div>
        <span className="text-gray-400 min-w-[3rem] text-sxx">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
            shuffle
              ? 'bg-enfasisColor/20 text-enfasisColor'
              : 'text-gray-400 hover:text-enfasisColor hover:bg-gray-100/5'
          }`}
          title="Aleatorio"
          disabled={isDragging}
        >
          <RandomIcon className="w-4 h-4" />
        </button>

        <button
          onClick={handlePrevious}
          className="p-2 text-gray-400 rounded-lg hover:text-enfasisColor hover:bg-gray-100/5 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!list.length || isDragging}
          title="Anterior"
        >
          <PreviousIcon className="w-5 h-5" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="p-3 bg-enfasisColor text-white rounded-full hover:bg-enfasisColor/80 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!!error || isDragging}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-2 text-gray-400 rounded-lg hover:text-enfasisColor hover:bg-gray-100/5 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!list.length || isDragging}
          title="Siguiente"
        >
          <NextIcon className="w-5 h-5" />
        </button>

        <button
          onClick={toggleRepeat}
          className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
            repeat
              ? 'bg-enfasisColor/20 text-enfasisColor'
              : 'text-gray-400 hover:text-enfasisColor hover:bg-gray-100/5'
          }`}
          title="Repetir"
          disabled={isDragging}
        >
          <RepeatIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-2 flex-1 max-w-32 group ${isVolumeDragging ? 'dragging' : ''}`}
        >
          <VolumeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 relative h-4 flex items-center">
            <div className="w-full h-1 bg-gray-100/10 rounded-full" />

            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-enfasisColor rounded-full transition-all duration-150 ease-out"
              style={{ width: `${volume * 100}%` }}
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              onMouseDown={handleVolumeStart}
              onMouseUp={handleVolumeEnd}
              onTouchStart={handleVolumeStart}
              onTouchEnd={handleVolumeEnd}
              className={`absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer slider-minimal ${
                isVolumeDragging ? 'dragging-active' : ''
              }`}
              title={`Volumen: ${Math.round(volume * 100)}%`}
            />
          </div>
          <span className="text-sxx text-gray-400 min-w-[2rem] text-center">
            {Math.round(volume * 100)}%
          </span>
        </div>

        <button
          onClick={handleToggleFormat}
          className="p-2 text-gray-400 rounded-lg hover:text-enfasisColor hover:bg-gray-100/5 transition-all duration-300 ease-in-out ml-4"
          title={`Cambiar a ${type === 'audio' ? 'video' : 'audio'}`}
          disabled={isDragging || isVolumeDragging}
        >
          <TrailerIcon className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sxx text-center bg-red-900/20 border border-red-500/20 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
