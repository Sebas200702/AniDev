import { useWindowWidth } from '@shared/hooks/window-width'
import { useEffect } from 'react'

/**
 * LoadWindowWidth component updates the window width in the application state on resize.
 *
 * @description This component monitors the browser window size and updates the application state
 * when resizing occurs. It performs a one-time initialization to set the initial width value
 * and then establishes an event listener for subsequent resize events. The component includes
 * a safeguard to ensure it only operates in browser environments where the window object exists.
 *
 * The component doesn't render any visible UI elements as its sole purpose is to maintain
 * the current window width in a centralized store. This width information can then be used
 * by other components to implement responsive behavior across the application without
 * duplicating resize listeners.
 *
 * By using this component at a high level in the component tree, the application can
 * efficiently track window dimensions with a single event listener while making the
 * information globally available through the shared store.
 *
 * @returns {null} The component doesn't render any visible elements
 *
 * @example
 * <LoadWindowWidth />
 */
export const LoadWindowWidth = () => {
  const { setWidth } = useWindowWidth()

  useEffect(() => {
    if (typeof window === 'undefined') return
    setWidth(window.innerWidth)
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])

  return null
}
