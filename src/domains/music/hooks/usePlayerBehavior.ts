import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

export const usePlayerBehavior = (
  playerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { setIsMinimized, isMinimized, setIsHidden } = useMusicPlayerStore()
  const isTransitioningRef = useRef(false)
  const currentPathRef = useRef(globalThis.location.pathname)

  const updateMinimizedState = useCallback(() => {
    const currentPath = globalThis.location.pathname
    const shouldMinimize = !currentPath.includes('/music/')

    if (
      currentPathRef.current !== currentPath ||
      shouldMinimize !== isMinimized
    ) {
      currentPathRef.current = currentPath
      setIsMinimized(shouldMinimize)

      if (!shouldMinimize) {
        setIsHidden(false)
      }
    }
  }, [setIsMinimized, isMinimized, setIsHidden])

  useLayoutEffect(() => {
    updateMinimizedState()
  }, [])

  useEffect(() => {
    let popPending = false

    const handleBeforeSwap = () => {
      isTransitioningRef.current = true
    }

    const handleAfterSwap = () => {
      isTransitioningRef.current = false
      setTimeout(updateMinimizedState, 10)
    }

    const handlePopstate = () => {
      popPending = true

      const handleAfterPopstate = () => {
        if (popPending) {
          updateMinimizedState()
          popPending = false
          document.removeEventListener('astro:after-swap', handleAfterPopstate)
        }
      }

      document.addEventListener('astro:after-swap', handleAfterPopstate)
    }

    const origPush = history.pushState
    const origReplace = history.replaceState

    history.pushState = function (...args) {
      origPush.apply(this, args)
      setTimeout(updateMinimizedState, 0)
    }

    history.replaceState = function (...args) {
      origReplace.apply(this, args)
      setTimeout(updateMinimizedState, 0)
    }

    // Event listeners
    window.addEventListener('popstate', handlePopstate)
    document.addEventListener('astro:before-swap', handleBeforeSwap)
    document.addEventListener('astro:after-swap', handleAfterSwap)

    const handleLocationChange = () => {
      if (!isTransitioningRef.current) {
        updateMinimizedState()
      }
    }

    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handlePopstate)
      window.removeEventListener('hashchange', handleLocationChange)
      document.removeEventListener('astro:before-swap', handleBeforeSwap)
      document.removeEventListener('astro:after-swap', handleAfterSwap)
      history.pushState = origPush
      history.replaceState = origReplace
      isTransitioningRef.current = false
    }
  }, [updateMinimizedState])

  useEffect(() => {
    if (!isMinimized) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (playerRef.current?.contains(target)) return

      const allowedSelectors = [
        '[data-music-player]',
        '.music-player',
        '#restore-player-button',
        '.music-player-related',
      ]

      const isAllowedClick = allowedSelectors.some(
        (selector) => target.closest(selector) || target.matches(selector)
      )

      if (!isAllowedClick) {
        setIsHidden(true)
      }
    }

    document.addEventListener('click', handleClickOutside, {
      capture: true,
      passive: true,
    })

    return () => {
      document.removeEventListener('click', handleClickOutside, {
        capture: true,
      })
    }
  }, [isMinimized, setIsHidden, playerRef])
}
