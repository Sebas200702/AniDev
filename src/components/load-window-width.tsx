import { useEffect } from 'react'
import { useWindowWidth } from '@store/window-width'
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
