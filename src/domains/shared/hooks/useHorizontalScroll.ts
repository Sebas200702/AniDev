import { useEffect, useRef, useState, useCallback } from 'react'

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
  scrollPadding = 32
}: Options = {}) => {
  const listRef = useRef<HTMLDivElement | HTMLUListElement>(null)
  const [showPrev, setShowPrev] = useState(false)
  const [showNext, setShowNext] = useState(true)
  const [windowWidth, setWindowWidth] = useState(0)


  const updateWindowWidth = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [updateWindowWidth])


  const updateButtonsVisibility = useCallback(() => {
    const container = listRef.current
    if (!container) return

    if (windowWidth < mobileBreakpoint) {
      setShowPrev(false)
      setShowNext(false)
      return
    }

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth

    setShowPrev(scrollLeft > 0)
    setShowNext(Math.ceil(scrollLeft) < maxScroll - 1)
  }, [windowWidth, mobileBreakpoint])

  useEffect(() => {
    const container = listRef.current
    if (!container || windowWidth === 0) return

    updateButtonsVisibility()

    container.addEventListener('scroll', updateButtonsVisibility)

    return () => {
      container.removeEventListener('scroll', updateButtonsVisibility)
    }
  }, [updateButtonsVisibility, windowWidth])

  const scrollNext = useCallback(() => {
    const container = listRef.current
    if (!container) return

    const clientWidth = container.clientWidth
    const groupWidth = clientWidth - scrollPadding

    container.scrollBy({
      left: groupWidth,
      behavior: 'smooth'
    })

    setTimeout(updateButtonsVisibility, 500)
  }, [scrollPadding, updateButtonsVisibility])

  const scrollPrev = useCallback(() => {
    const container = listRef.current
    if (!container) return

    const clientWidth = container.clientWidth
    const groupWidth = clientWidth - scrollPadding

    container.scrollBy({
      left: -groupWidth,
      behavior: 'smooth'
    })

    setTimeout(updateButtonsVisibility, 500)
  }, [scrollPadding, updateButtonsVisibility])

  return {
    listRef,
    showPrev,
    showNext,
    scrollNext,
    scrollPrev,
    windowWidth
  }
}
