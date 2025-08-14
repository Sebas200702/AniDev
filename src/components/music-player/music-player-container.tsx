import { MusicPlayer } from '@components/music-player/music-player'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'

export const MusicPlayerContainer = ({ className }: { className?: string }) => {
  const portalElementRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!portalElementRef.current) {
      portalElementRef.current = document.createElement('div')
      portalElementRef.current.id = 'music-player-portal'
      if (className !== undefined) {
        portalElementRef.current.className = className
      } else {
        portalElementRef.current.removeAttribute('class')
      }
    }

    const movePortalContainer = () => {
      const pathname = window.location.pathname
      const targetId = pathname.startsWith('/music')
        ? 'music-player-container'
        : 'layout-player-container'
      let targetParent = document.getElementById(targetId)
      if (!targetParent) {
        const fallbackId = targetId === 'music-player-container' ? 'layout-player-container' : 'music-player-container'
        targetParent = document.getElementById(fallbackId)
      }
      const el = portalElementRef.current
      if (targetParent && el && el.parentElement !== targetParent) {
        targetParent.appendChild(el)
        setIsReady(true)
      }
    }


    movePortalContainer()

    const observer = new MutationObserver(() => {
      const el = portalElementRef.current
      if (!el || el.parentElement) {
        return
      }
      movePortalContainer()
      if (el.parentElement) {
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const handleNavigation = () => movePortalContainer()
    document.addEventListener('astro:after-swap', handleNavigation)
    document.addEventListener('astro:page-load', handleNavigation)

    return () => {
      document.removeEventListener('astro:after-swap', handleNavigation)
      document.removeEventListener('astro:page-load', handleNavigation)
      observer.disconnect()
    }
  }, [className])


  useEffect(() => {
    const el = portalElementRef.current
    if (!el) return
    if (className === undefined) {
      el.removeAttribute('class')
      return
    }
    el.className = className
  }, [className])

  if (!isReady || !portalElementRef.current) return null

  return createPortal(<MusicPlayer />, portalElementRef.current)
}
