import { navigate } from 'astro:transitions/client'
import { Controls } from '@components/music-player/controls'
import { Cover } from '@components/music-player/cover'
import { ExpandIcon } from '@icons/expand-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { useWindowWidth } from '@store/window-width'
import { normalizeString } from '@utils/normalize-string'
import { useCallback, useEffect, useRef } from 'react'

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
    isHidden,
    dragOffset,
    setDragOffset,
    setCurrentSong,
    setIsHidden,
    position,
    setPosition,
  } = useMusicPlayerStore()
  const { width } = useWindowWidth()

  const isMobile = width < 640

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

      const playerWidth = playerRef.current?.offsetWidth || 320
      const playerHeight = playerRef.current?.offsetHeight || 400
      const margin = window.innerWidth < 640 ? 5 : 1

      const newX = window.innerWidth - (e.clientX - dragOffset.x + playerWidth)
      const newY =
        window.innerHeight - (e.clientY - dragOffset.y + playerHeight)

      const limitedX = Math.max(
        margin,
        Math.min(newX, window.innerWidth - playerWidth - margin)
      )
      const limitedY = Math.max(margin, Math.min(newY, window.innerHeight - 50))

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
      const playerWidth = playerRef.current?.offsetWidth || 320
      const playerHeight = playerRef.current?.offsetHeight || 400
      const margin = window.innerWidth < 640 ? 5 : 10

      const newX =
        window.innerWidth - (touch.clientX - dragOffset.x + playerWidth)
      const newY =
        window.innerHeight - (touch.clientY - dragOffset.y + playerHeight)

      const limitedX = Math.max(
        margin,
        Math.min(newX, window.innerWidth - playerWidth - margin)
      )
      const limitedY = Math.max(margin, Math.min(newY, window.innerHeight - 50))

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
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (!playerRef.current) return

      if (playerRef.current.contains(target)) return

      if (
        target.closest('[data-music-player]') ||
        target.closest('.music-player') ||
        target.closest('#restore-player-button') ||
        target.classList.contains('music-player-related')
      ) {
        return
      }

      if (isMinimized) {
        setIsHidden(true)
      }
    }

    if (isMinimized) {
      document.addEventListener('click', handleClickOutside, true)
      return () =>
        document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isMinimized, setIsHidden])

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

  useEffect(() => {
    const updateMinimizedState = () => {
      if (window.location.pathname.includes('/music')) {
        setIsMinimized(false)
      } else {
        setIsMinimized(true)
      }
    }

    updateMinimizedState()

    const handleLocationChange = () => {
      updateMinimizedState()
    }

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

  return (
    <article
      ref={playerRef}
      data-music-player="true"
      className={`group rounded-xl transition-all duration-300 ease-in-out ${isHidden ? 'hidden' : ''} ${isMinimized ? 'from-Complementary/50 to-Complementary/80 fixed z-20 w-full max-w-60 sm:max-w-sm md:max-w-80 overflow-hidden border border-gray-100/20 bg-gradient-to-br shadow-lg backdrop-blur-sm' : 'bg-Complementary/50 mx-4 my-20 max-w-6xl md:mx-20'} ${
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
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/5 to-transparent opacity-50" />

      <header
        className={`relative ${isMinimized && isMobile ? 'border-none p-2' : 'border-b border-gray-100/10'} ${isMinimized && !isMobile ? 'p-4' : !isMinimized ? 'p-4' : ''} ${isDraggingPlayer ? 'pointer-events-none' : ''}`}
      >
        {isMinimized && isMobile ? (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-Primary-800 animate-spin-slow">
              {currentSong.image && (
                <img
                  src={currentSong.image}
                  alt={currentSong.anime_title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-white truncate leading-tight">
                {currentSong.song_title}
              </h4>
              <p className="text-xs text-enfasisColor truncate leading-tight">
                {currentSong.anime_title}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
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
                className="w-8 h-8 rounded-full bg-enfasisColor text-Primary-950 flex items-center justify-center active:scale-95 transition-transform"
              >
                {isPlaying ? (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 ml-0.5"
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
                className="w-7 h-7 rounded-full bg-Primary-800 text-enfasisColor flex items-center justify-center active:scale-95 transition-transform"
              >
                <ExpandIcon className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const media = getMediaRef()
                  if (media) {
                    media.pause()
                  }

                  setCurrentSong(null)
                  setIsPlaying(false)
                  setCurrentTime(0)
                  setDuration(0)
                }}
                className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex ${isMinimized ? 'items-start justify-between gap-3' : 'items-start justify-between gap-3'}`}
          >
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

              <div
                className={`flex items-center gap-2 ${isMinimized ? '' : 'hidden'}`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(
                      `/music/${normalizeString(currentSong.song_title)}_${currentSong.theme_id}`
                    )
                  }}
                  className="text-Primary-50 cursor-pointer p-4"
                >
                  <ExpandIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const media = getMediaRef()
                    if (media) {
                      media.pause()
                    }

                    setCurrentSong(null)
                    setIsPlaying(false)
                    setCurrentTime(0)
                    setDuration(0)
                  }}
                  className="text-red-500 cursor-pointer p-4 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {isMinimized && !isMobile && (
          <div className="from-enfasisColor/0 to-enfasisColor/20 pointer-events-none absolute inset-0 rounded-t-xl bg-gradient-to-r opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
        )}
      </header>

      {!(isMinimized && isMobile) && <Cover />}

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

      {!(isMinimized && isMobile) && (
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
      )}
    </article>
  )
}
