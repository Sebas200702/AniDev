import { useMusicPlayerStore } from '@store/music-player-store'
import { useEffect } from 'react'

export const usePlayerBehavior = (
  playerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { setIsMinimized, isMinimized, setIsHidden } = useMusicPlayerStore()

  // Controlar estado minimizado según la ruta
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

  // Manejar clics fuera del reproductor
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
  }, [isMinimized, setIsHidden, playerRef])
}
