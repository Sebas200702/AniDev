import { useEffect, useRef, useState } from 'react'

export const useThemeId = () => {
  const [themeId, setThemeId] = useState<string | null>(null)
  const debounceTimeoutRef = useRef<number | null>(null)

  const extractThemeIdFromPath = () => {
    if (
      typeof window === 'undefined' ||
      !window.location.pathname.includes('/music')
    )
      return null
    const parts = window.location.pathname.split('_')
    return parts.length > 1 ? parts[1] : null
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    setThemeId(extractThemeIdFromPath())

    const updateDebounced = () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = window.setTimeout(() => {
        setThemeId(extractThemeIdFromPath())
      }, 100)
    }

    window.addEventListener('popstate', updateDebounced)
    document.addEventListener('astro:page-load', updateDebounced)
    document.addEventListener('astro:after-swap', updateDebounced)

    const observer = new MutationObserver(() => updateDebounced())
    observer.observe(document, { subtree: true, childList: true })

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
      window.removeEventListener('popstate', updateDebounced)
      document.removeEventListener('astro:page-load', updateDebounced)
      document.removeEventListener('astro:after-swap', updateDebounced)
      observer.disconnect()
    }
  }, [])

  return themeId
}
