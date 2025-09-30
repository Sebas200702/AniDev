import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Options {
  mobileBreakpoint?: number // default: 768
  scrollPadding?: number // espacio a restar al ancho del contenedor para el scroll
}

/**
 * Hook reutilizable para manejar scroll horizontal en un carrusel
 * con navegación prev/next y visibilidad de botones.
 *
 * Funciona tanto para listas UL como para contenedores DIV/SECTION.
 */
export const useHorizontalScroll = ({
  mobileBreakpoint = 768,
  scrollPadding = 32,
}: Options = {}) => {
  const listRef = useRef<HTMLDivElement | HTMLUListElement>(null)
  const [showPrev, setShowPrev] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const isMobile = useMemo(
    () => windowWidth < mobileBreakpoint,
    [windowWidth, mobileBreakpoint]
  )
  const container = listRef.current

  const updateWindowWidth = useCallback(() => {
    if (typeof window !== 'undefined') setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [updateWindowWidth])

  const updateButtonsVisibility = useCallback(() => {
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      const maxScroll = scrollWidth - clientWidth

      setShowPrev(scrollLeft > 0)
      setShowNext(Math.ceil(scrollLeft) < maxScroll - 1)
    }

    if (isMobile) {
      setShowPrev(false)
      setShowNext(false)
      return
    }
  }, [windowWidth, mobileBreakpoint, container])

  useEffect(() => {
    if (!container) return

    updateButtonsVisibility()

    const handleScroll = () => {
      updateButtonsVisibility()
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [updateButtonsVisibility])

  useEffect(() => {
    updateButtonsVisibility()
  }, [windowWidth, updateButtonsVisibility])

  const scrollNext = useCallback(() => {
    if (!container || windowWidth < mobileBreakpoint) return

    const clientWidth = container.clientWidth
    const groupWidth = clientWidth - scrollPadding

    container.scrollBy({
      left: groupWidth,
      behavior: 'smooth',
    })

    setTimeout(updateButtonsVisibility, 100)
  }, [scrollPadding, updateButtonsVisibility, windowWidth, mobileBreakpoint])

  const scrollPrev = useCallback(() => {
    if (!container || windowWidth < mobileBreakpoint) return

    const clientWidth = container.clientWidth
    const groupWidth = clientWidth - scrollPadding

    container.scrollBy({
      left: -groupWidth,
      behavior: 'smooth',
    })

    setTimeout(updateButtonsVisibility, 100)
  }, [scrollPadding, updateButtonsVisibility, windowWidth, mobileBreakpoint])

  return {
    listRef,
    showPrev: isMobile ? false : showPrev,
    showNext: isMobile ? false : showNext,
    scrollNext,
    scrollPrev,
    windowWidth,
    isMobile,
  }
}
