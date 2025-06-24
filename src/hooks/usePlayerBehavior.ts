import { useMusicPlayerStore } from '@store/music-player-store'
import { useCallback, useEffect, useLayoutEffect } from 'react'

type ViewTransitionEvent = Event & {
  viewTransition?: { finished: Promise<void> }
}

export const usePlayerBehavior = (
  playerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { setIsMinimized, isMinimized, setIsHidden } = useMusicPlayerStore()

  const updateMinimizedState = useCallback(() => {
    if (!window.location.pathname.includes('/music')) {
      setIsMinimized(true)
    } else {
      setIsMinimized(false)
    }
  }, [setIsMinimized, window.location.pathname])

  useLayoutEffect(() => {
    updateMinimizedState()
  }, [updateMinimizedState])

  useEffect(() => {
    let popPending = false
    const handleAfterSwap = () => {
      updateMinimizedState()
    }

    const handleBeforeSwap = (e: ViewTransitionEvent) => {
      if (e.viewTransition?.finished) {
        e.viewTransition.finished.then(() => updateMinimizedState())
      }
    }

    const handlePopstate = () => {
      popPending = true
      const once = () => {
        if (popPending) {
          updateMinimizedState()
          popPending = false
          document.removeEventListener('astro:after-swap', once)
        }
      }
      document.addEventListener('astro:after-swap', once)
    }

    const origPush = history.pushState
    const origReplace = history.replaceState

    history.pushState = function (...args) {
      origPush.apply(this, args)
      updateMinimizedState()
    }
    history.replaceState = function (...args) {
      origReplace.apply(this, args)
      updateMinimizedState()
    }

    window.addEventListener('popstate', handlePopstate)
    document.addEventListener('astro:after-swap', handleAfterSwap)
    document.addEventListener('astro:before-swap', handleBeforeSwap)

    return () => {
      window.removeEventListener('popstate', handlePopstate)
      document.removeEventListener('astro:after-swap', handleAfterSwap)
      document.removeEventListener('astro:before-swap', handleBeforeSwap)
      history.pushState = origPush
      history.replaceState = origReplace
    }
  }, [updateMinimizedState])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!playerRef.current || playerRef.current.contains(target)) return
      if (
        target.closest('[data-music-player]') ||
        target.closest('.music-player') ||
        target.closest('#restore-player-button') ||
        target.classList.contains('music-player-related')
      ) {
        return
      }
      if (isMinimized) setIsHidden(true)
    }

    if (isMinimized) {
      document.addEventListener('click', handleClickOutside, true)
      return () =>
        document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isMinimized, setIsHidden, playerRef])
}
