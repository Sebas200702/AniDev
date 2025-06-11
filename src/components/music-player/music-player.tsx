import { navigate } from 'astro:transitions/client'
import { Controls } from '@components/music-player/controls'
import { Cover } from '@components/music-player/cover'
import { ExpandIcon } from '@icons/expand-icon'
import { normalizeString } from '@utils/normalize-string'

import { useMusicPlayerStore } from '@store/music-player-store'
import { useCallback, useEffect, useRef, useState } from 'react'

export const MusicPlayer = () => {
  const {
    isPlaying,
    currentSong,
    setIsPlaying,
    setCurrentTime,
    type,
    setDuration,
    setIsLoading,
    repeat,
    isDragging,
    isMinimized,
    setIsMinimized,
    error,
    setError,
    volume,
    savedTime,
    setSavedTime,
    isChangingFormat,
    setIsChangingFormat,
    currentTimeLocal,
    setCurrentTimeLocal,
    durationLocal,
    setDurationLocal,
    isDraggingPlayer,
    setIsDraggingPlayer,
    dragOffset,
    setDragOffset,
    position,
    setPosition,
  } = useMusicPlayerStore()

  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLElement>(null)

  const getMediaRef = () => {
    return type === 'video' ? videoRef.current : audioRef.current
  }

  const handleNext = useCallback(() => {
    const media = getMediaRef()
    if (!media) return

    if (repeat) {
      media.currentTime = 0
      media.play()
    }
  }, [repeat])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.controls-area')
      ) {
        return
      }

      const rect = playerRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
        setIsDraggingPlayer(true)
      }
    },
    [setDragOffset, setIsDraggingPlayer]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingPlayer) return

      const newX = window.innerWidth - (e.clientX - dragOffset.x + 320)
      const newY =
        window.innerHeight -
        (e.clientY - dragOffset.y + (playerRef.current?.offsetHeight || 400))

      const limitedX = Math.max(10, Math.min(newX, window.innerWidth - 330))
      const limitedY = Math.max(10, Math.min(newY, window.innerHeight - 50))

      setPosition({ x: limitedX, y: limitedY })
    },
    [isDraggingPlayer, dragOffset, setPosition]
  )

  const handleMouseUp = useCallback(() => {
    setIsDraggingPlayer(false)
  }, [setIsDraggingPlayer])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.controls-area')
      ) {
        return
      }

      const touch = e.touches[0]
      const rect = playerRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        })
        setIsDraggingPlayer(true)
      }
    },
    [setDragOffset, setIsDraggingPlayer]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingPlayer) return
      e.preventDefault()

      const touch = e.touches[0]
      const newX = window.innerWidth - (touch.clientX - dragOffset.x + 320)
      const newY =
        window.innerHeight -
        (touch.clientY -
          dragOffset.y +
          (playerRef.current?.offsetHeight || 400))

      const limitedX = Math.max(10, Math.min(newX, window.innerWidth - 330))
      const limitedY = Math.max(10, Math.min(newY, window.innerHeight - 50))

      setPosition({ x: limitedX, y: limitedY })
    },
    [isDraggingPlayer, dragOffset, setPosition]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDraggingPlayer(false)
  }, [setIsDraggingPlayer])

  useEffect(() => {
    if (isDraggingPlayer) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [
    isDraggingPlayer,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ])

  useEffect(() => {
    const media = getMediaRef()
    if (!media) return

    const onTimeUpdate = () => {
      if (!isDragging) {
        const time = media.currentTime
        setCurrentTimeLocal(time)
        setCurrentTime(time)
      }
    }

    const onLoadStart = () => setIsLoading(true)

    const onCanPlay = () => {
      setIsLoading(false)
      setError(null)
      const mediaDuration = media.duration
      setDurationLocal(mediaDuration)
      setDuration(mediaDuration)

      if (isChangingFormat && savedTime > 0) {
        media.currentTime = savedTime
        setCurrentTimeLocal(savedTime)
        setCurrentTime(savedTime)

        setIsChangingFormat(false)
        setSavedTime(0)

        if (isPlaying) {
          setTimeout(() => {
            media.play().catch((err) => {
              console.error(
                'Error al reproducir después del cambio de formato:',
                err
              )
              setError('Error al cambiar formato')
              setIsPlaying(false)
            })
          }, 50)
        }
      }
    }

    const onLoadedData = () => {
      if (isChangingFormat && savedTime > 0) {
        media.currentTime = savedTime
        setCurrentTimeLocal(savedTime)
        setCurrentTime(savedTime)
      }
    }

    const onSeeked = () => {
      if (isChangingFormat && isPlaying) {
        media.play().catch((err) => {
          console.error('Error al reproducir después del seek:', err)
          setError('Error al sincronizar')
        })
      }
    }

    const onError = () => {
      setIsLoading(false)
      setError('Error al cargar el media')
      setIsPlaying(false)
    }

    const onEnded = () => {
      handleNext()
    }

    media.addEventListener('timeupdate', onTimeUpdate)
    media.addEventListener('loadstart', onLoadStart)
    media.addEventListener('canplay', onCanPlay)
    media.addEventListener('loadeddata', onLoadedData)
    media.addEventListener('seeked', onSeeked)
    media.addEventListener('error', onError)
    media.addEventListener('ended', onEnded)

    return () => {
      media.removeEventListener('timeupdate', onTimeUpdate)
      media.removeEventListener('loadstart', onLoadStart)
      media.removeEventListener('canplay', onCanPlay)
      media.removeEventListener('loadeddata', onLoadedData)
      media.removeEventListener('seeked', onSeeked)
      media.removeEventListener('error', onError)
      media.removeEventListener('ended', onEnded)
    }
  }, [
    repeat,
    isDragging,
    setCurrentTime,
    type,
    isChangingFormat,
    savedTime,
    isPlaying,
    handleNext,
    setDuration,
    setIsLoading,
    setError,
    setIsPlaying,
    setCurrentTimeLocal,
    setDurationLocal,
    setIsChangingFormat,
    setSavedTime,
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
      if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        playMedia()
      } else {
        const onCanPlayThrough = () => {
          media.removeEventListener('canplaythrough', onCanPlayThrough)
          playMedia()
        }
        media.addEventListener('canplaythrough', onCanPlayThrough)

        return () => {
          media.removeEventListener('canplaythrough', onCanPlayThrough)
        }
      }
    } else {
      media.pause()
    }
  }, [
    isPlaying,
    currentSong,
    type,
    isChangingFormat,
    setIsLoading,
    setError,
    setIsPlaying,
  ])

  useEffect(() => {
    const media = getMediaRef()
    if (media) {
      media.volume = volume
    }
  }, [volume, type])

  // Detectar dispositivos móviles
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || isSmallScreen)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  useEffect(() => {
    // Función para actualizar el estado según la ruta actual
    const updateMinimizedState = () => {
      if (window.location.pathname.includes('/music')) {
        setIsMinimized(false)
      } else {
        setIsMinimized(true)
      }
    }

    // Ejecutar inmediatamente
    updateMinimizedState()

    // Escuchar cambios de ruta
    const handleLocationChange = () => {
      updateMinimizedState()
    }

    // Event listeners para detectar cambios de navegación
    window.addEventListener('popstate', handleLocationChange)

    document.addEventListener('astro:page-load', handleLocationChange)

    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      originalPushState.apply(history, args)
      setTimeout(handleLocationChange, 0)
    }

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args)
      setTimeout(handleLocationChange, 0)
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      document.removeEventListener('astro:page-load', handleLocationChange)

      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [setIsMinimized])

  useEffect(() => {
    if (currentSong && !isChangingFormat) {
      const audioElement = audioRef.current
      const videoElement = videoRef.current

      if (audioElement && videoElement) {
        const activeElement = getMediaRef()
        const inactiveElement = type === 'video' ? audioElement : videoElement

        if (activeElement && inactiveElement) {
          const timeDifference = Math.abs(
            activeElement.currentTime - inactiveElement.currentTime
          )
          if (timeDifference > 0.5) {
            inactiveElement.currentTime = activeElement.currentTime
          }
        }
      }
    }
  }, [currentSong, type, isChangingFormat, currentTimeLocal])

  useEffect(() => {
    if (isChangingFormat && savedTime > 0) {
      const audioElement = audioRef.current
      const videoElement = videoRef.current
      const targetElement = type === 'video' ? videoElement : audioElement

      if (
        targetElement &&
        targetElement.readyState >= HTMLMediaElement.HAVE_METADATA
      ) {
        targetElement.currentTime = savedTime
      }
    }
  }, [isChangingFormat, savedTime, type])

  if (!currentSong) return null

  // Versión móvil compacta con drag and drop
  if (isMinimized && isMobile) {
    return (
      <article
        ref={playerRef}
        className={`bg-Primary-950/60 fixed z-20 w-72 max-w-xs rounded-xl border border-gray-100/20 shadow-lg backdrop-blur-md transition-all duration-200 ${
          isDraggingPlayer ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{
          bottom: `${position.y}px`,
          right: `${position.x}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Header ultra-compacto */}
        <div className="flex items-center gap-2 p-2">
          {/* Miniatura pequeña */}
          <div className="bg-Primary-800 h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
            {currentSong.image && (
              <img
                src={currentSong.image}
                alt={currentSong.anime_title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* Info ultra-compacta */}
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs leading-tight font-medium text-white">
              {currentSong.song_title}
            </h4>
            <p className="truncate text-xs leading-tight text-gray-400">
              {currentSong.anime_title}
            </p>
          </div>

          {/* Controles mínimos */}
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                const media = getMediaRef()
                if (media) {
                  if (isPlaying) {
                    media.pause()
                    setIsPlaying(false)
                  } else {
                    media.play().catch(() => setIsPlaying(false))
                    setIsPlaying(true)
                  }
                }
              }}
              className="bg-enfasisColor text-Primary-950 flex h-7 w-7 items-center justify-center rounded-full transition-transform active:scale-95"
            >
              {isPlaying ? (
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="ml-0.5 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(
                  `/music/${normalizeString(currentSong.song_title)}_${currentSong.theme_id}`
                )
              }}
              className="bg-Primary-800 text-enfasisColor flex h-6 w-6 items-center justify-center rounded-full transition-transform active:scale-95"
            >
              <ExpandIcon className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Barra de progreso ultra-fina */}
        <div className="px-2 pb-1">
          <div className="bg-Primary-800 h-0.5 w-full rounded-full">
            <div
              className="bg-enfasisColor h-0.5 rounded-full transition-all duration-100"
              style={{
                width:
                  durationLocal > 0
                    ? `${(currentTimeLocal / durationLocal) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>

        {/* Audio/Video elements ocultos */}
        <audio ref={audioRef} src={currentSong.audio_url} preload="metadata">
          <track kind="captions" />
        </audio>
        <video
          ref={videoRef}
          src={currentSong.video_url}
          preload="metadata"
          className="hidden"
          controls={false}
          muted={type !== 'video'}
        >
          <track kind="captions" />
        </video>
      </article>
    )
  }

  return (
    <article
      ref={playerRef}
      className={`group rounded-xl transition-all duration-300 ease-in-out ${isMinimized ? 'from-Complementary/50 to-Complementary/80 fixed z-20 w-full overflow-hidden border border-gray-100/20 bg-gradient-to-br shadow-lg backdrop-blur-sm md:max-w-80' : 'bg-Complementary mx-4 my-20 max-w-6xl md:mx-20'} ${
        isDraggingPlayer && isMinimized
          ? 'music-player-dragging cursor-grabbing select-none'
          : ''
      }`}
      style={
        isMinimized
          ? {
              bottom: `${position.y}px`,
              right: `${position.x}px`,
            }
          : {}
      }
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/5 to-transparent opacity-50" />

      <header
        className={`relative border-b border-gray-100/10 p-4 ${isDraggingPlayer ? 'pointer-events-none' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className={
                isMinimized
                  ? 'text-s mb-1 truncate leading-tight font-medium text-white'
                  : 'mb-1 text-2xl font-semibold'
              }
            >
              {currentSong.song_title}
            </h3>
            <p className="text-sxx mb-1 truncate text-gray-400">
              {currentSong.artist_name || 'Artista desconocido'}
            </p>
            <small className="text-sxx text-enfasisColor tracking-wider uppercase">
              {currentSong.anime_title}
            </small>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-sxx text-enfasisColor tracking-wider uppercase">
              {type}
            </span>

            <button
              onClick={() =>
                navigate(
                  `/music/${normalizeString(currentSong.song_title)}_${currentSong.theme_id}`
                )
              }
              className={`text-Primary-50 cursor-pointer p-4 ${isMinimized ? '' : 'hidden'}`}
            >
              <ExpandIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isMinimized && (
          <div className="from-enfasisColor/0 to-enfasisColor/20 pointer-events-none absolute inset-0 rounded-t-xl bg-gradient-to-r opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
        )}
      </header>

      <Cover />

      <audio ref={audioRef} src={currentSong.audio_url} preload="metadata">
        <track kind="captions" />
      </audio>

      <video
        ref={videoRef}
        src={currentSong.video_url}
        preload="metadata"
        className={type === 'video' ? 'w-full opacity-100' : 'h-0 opacity-0'}
        controls={false}
        muted={type !== 'video'}
      >
        <track kind="captions" />
      </video>

      <div className="bg-Primary-950/30 controls-area border-t border-gray-100/10 backdrop-blur-sm">
        <Controls
          audioRef={audioRef}
          videoRef={videoRef}
          currentTime={currentTimeLocal}
          duration={durationLocal}
          setSavedTime={setSavedTime}
          setIsChangingFormat={setIsChangingFormat}
        />
      </div>
    </article>
  )
}
