import { useEffect } from 'react'
import { useWindowWidth } from '@store/window-width'

/**
 * LoadWindowWidth component updates the window width in the application state on resize.
 *
 * This component does not render any UI elements.
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
