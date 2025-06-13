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
  audioRef: React.RefObject<HTMLAudioElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
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

  // Manejo unificado para eventos táctiles y de ratón
  const handleSeekStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragPosition(currentTime)

    if (isPlaying) {
      const media = getMediaRef()
      if (media) {
        media.pause()
      }
    }
  }

  const handleSeekEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation()
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

  // Manejo unificado para eventos de volumen
  const handleVolumeStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation()
    setIsVolumeDragging(true)
  }
  
  const handleVolumeEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation()
    setIsVolumeDragging(false)
  }

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
    <div className="w-full space-y-3 p-4" id="music-player-controls">
      <div className="flex items-center space-x-3 text-sm">
        <span className="text-sxx min-w-[3rem] text-gray-400">
          {formatTime(isDragging ? dragPosition : currentTime)}
        </span>
        <div className={`group flex-1 ${isDragging ? 'dragging' : ''}`}>
          <div className="relative flex h-4 items-center">
            <div className="h-1 w-full rounded-full bg-gray-100/10" />

            <div
              className="bg-enfasisColor absolute top-1/2 left-0 h-1 -translate-y-1/2 transform rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${((isDragging ? dragPosition : currentTime) / duration) * 100 || 0}%`,
              }}
            />

            {isDragging && (
              <div
                className="absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/60"
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
              className={`slider-minimal absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent ${
                isDragging ? 'dragging-active' : ''
              }`}
            />
          </div>
        </div>
        <span className="text-sxx min-w-[3rem] text-gray-400">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleShuffle()
          }}
          className={`rounded-lg p-2 transition-all duration-300 ease-in-out ${
            shuffle
              ? 'bg-enfasisColor/20 text-enfasisColor'
              : 'hover:text-enfasisColor text-gray-400 hover:bg-gray-100/5'
          }`}
          title="Aleatorio"
          disabled={isDragging}
          aria-label={shuffle ? "Desactivar aleatorio" : "Activar aleatorio"}
        >
          <RandomIcon className="h-4 w-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePrevious()
          }}
          className="hover:text-enfasisColor rounded-lg p-2 text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-100/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!list.length || isDragging}
          title="Anterior"
          aria-label="Canción anterior"
        >
          <PreviousIcon className="h-5 w-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleTogglePlay()
          }}
          className="bg-enfasisColor hover:bg-enfasisColor/80 rounded-full p-3 text-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!!error || isDragging}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          className="hover:text-enfasisColor rounded-lg p-2 text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-100/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!list.length || isDragging}
          title="Siguiente"
          aria-label="Siguiente canción"
        >
          <NextIcon className="h-5 w-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleRepeat()
          }}
          className={`rounded-lg p-2 transition-all duration-300 ease-in-out ${
            repeat
              ? 'bg-enfasisColor/20 text-enfasisColor'
              : 'hover:text-enfasisColor text-gray-400 hover:bg-gray-100/5'
          }`}
          title="Repetir"
          disabled={isDragging}
          aria-label={repeat ? "Desactivar repetición" : "Activar repetición"}
        >
          <RepeatIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`group flex max-w-32 flex-1 items-center space-x-2 ${isVolumeDragging ? 'dragging' : ''}`}
        >
          <VolumeIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <div className="relative flex h-5 flex-1 items-center">
            <div className="h-1 w-full rounded-full bg-gray-100/10" />

            <div
              className="bg-enfasisColor absolute top-1/2 left-0 h-1 -translate-y-1/2 transform rounded-full transition-all duration-150 ease-out"
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
              className={`slider-minimal absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent ${
                isVolumeDragging ? 'dragging-active' : ''
              }`}
              title={`Volumen: ${Math.round(volume * 100)}%`}
              aria-label="Control de volumen"
            />
          </div>
          <span className="text-sxx min-w-[2rem] text-center text-gray-400">
            {Math.round(volume * 100)}%
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggleFormat()
          }}
          className="hover:text-enfasisColor ml-4 rounded-lg p-4 text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-100/5"
          title={`Cambiar a ${type === 'audio' ? 'video' : 'audio'}`}
          disabled={isDragging || isVolumeDragging}
          aria-label={`Cambiar a formato ${type === 'audio' ? 'video' : 'audio'}`}
        >
          <TrailerIcon className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="text-sxx rounded-lg border border-red-500/20 bg-red-900/20 p-2 text-center text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}