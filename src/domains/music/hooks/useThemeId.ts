import { useEffect, useRef, useState } from 'react'

const getThemeIdFromPath = (): number | null => {
  if (typeof globalThis === 'undefined') return null

  const path = globalThis.location.pathname
  if (!path.includes('/music/')) return null

  const [, id] = path.split('_')
  return id ? Number(id) : null
}

export const useThemeId = () => {
  const [themeId, setThemeId] = useState<number | null>(getThemeIdFromPath)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof globalThis === 'undefined') return

    const update = () => setThemeId(getThemeIdFromPath())

    const updateDebounced = () => {
      if (timeoutRef.current) globalThis.clearTimeout(timeoutRef.current)
      timeoutRef.current = globalThis.setTimeout(update, 100)
    }

    update()

    globalThis.addEventListener('popstate', updateDebounced)
    document.addEventListener('astro:page-load', updateDebounced)
    document.addEventListener('astro:after-swap', updateDebounced)

    const observer = new MutationObserver(updateDebounced)
    observer.observe(document, { subtree: true, childList: true })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      globalThis.removeEventListener('popstate', updateDebounced)
      document.removeEventListener('astro:page-load', updateDebounced)
      document.removeEventListener('astro:after-swap', updateDebounced)
      observer.disconnect()
    }
  }, [])

  return themeId
}
