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

  useEffect(() => {
    if (typeof globalThis === 'undefined') return

    const update = () => setThemeId(getThemeIdFromPath())

    globalThis.addEventListener('popstate', update)
    document.addEventListener('astro:page-load', update)
    document.addEventListener('astro:after-swap', update)

    update()

    return () => {
      globalThis.removeEventListener('popstate', update)
      document.removeEventListener('astro:page-load', update)
      document.removeEventListener('astro:after-swap', update)
    }
  }, [])

  return themeId
}
