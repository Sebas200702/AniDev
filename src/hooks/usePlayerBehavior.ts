import { useMusicPlayerStore } from '@store/music-player-store'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

type ViewTransitionEvent = Event & {
  viewTransition?: { finished: Promise<void> }
}

export const usePlayerBehavior = (
  playerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { setIsMinimized, isMinimized, setIsHidden } = useMusicPlayerStore()
  const isTransitioningRef = useRef(false)
  const currentPathRef = useRef(window.location.pathname)

  const updateMinimizedState = useCallback(() => {
    const currentPath = window.location.pathname
    const shouldMinimize = !currentPath.includes('/music')

    // Solo actualizar si el path cambió o el estado es diferente
    if (currentPathRef.current !== currentPath || shouldMinimize !== isMinimized) {
      currentPathRef.current = currentPath
      setIsMinimized(shouldMinimize)

      // Si estamos en /music, quitar el estado hidden para mostrar el reproductor
      if (!shouldMinimize) {
        setIsHidden(false)
      }
    }
  }, [setIsMinimized, isMinimized, setIsHidden])

  // Estado inicial
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
      // Pequeño delay para asegurar que el DOM esté actualizado
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

    // Interceptar navegación programática
    const origPush = history.pushState
    const origReplace = history.replaceState

    history.pushState = function (...args) {
      origPush.apply(this, args)
      // Actualizar inmediatamente después del push
      setTimeout(updateMinimizedState, 0)
    }

    history.replaceState = function (...args) {
      origReplace.apply(this, args)
      // Actualizar inmediatamente después del replace
      setTimeout(updateMinimizedState, 0)
    }

    // Event listeners
    window.addEventListener('popstate', handlePopstate)
    document.addEventListener('astro:before-swap', handleBeforeSwap)
    document.addEventListener('astro:after-swap', handleAfterSwap)

    // Observador de cambios de URL para casos edge
    const handleLocationChange = () => {
      if (!isTransitioningRef.current) {
        updateMinimizedState()
      }
    }

    // Listener adicional para cambios de hash o search params
    window.addEventListener('hashchange', handleLocationChange)

    // Cleanup
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

  // Manejo de clicks fuera del reproductor
  useEffect(() => {
    if (!isMinimized) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Si el click es dentro del reproductor, no hacer nada
      if (playerRef.current?.contains(target)) return

      // Lista de selectores que no deben ocultar el reproductor
      const allowedSelectors = [
        '[data-music-player]',
        '.music-player',
        '#restore-player-button',
        '.music-player-related'
      ]

      const isAllowedClick = allowedSelectors.some(selector =>
        target.closest(selector) || target.matches(selector)
      )

      if (!isAllowedClick) {
        setIsHidden(true)
      }
    }

    document.addEventListener('click', handleClickOutside, {
      capture: true,
      passive: true
    })

    return () => {
      document.removeEventListener('click', handleClickOutside, { capture: true })
    }
  }, [isMinimized, setIsHidden, playerRef])

}
