import { useEffect } from 'react'

type Shortcut = { keys: string[]; action: string }
type ActionMap = Record<string, () => void>

export function useShortcuts(shortCuts: Shortcut[], actionMap: ActionMap) {
  useEffect(() => {
    const map = Object.fromEntries(
      shortCuts.map((s) => [s.keys.join('+'), actionMap[s.action]])
    )


    const handler = (evt: KeyboardEvent) => {
      const combo = [
        evt.ctrlKey && 'ctrl',
        evt.shiftKey && 'shift',
        evt.altKey && 'alt',
        evt.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+')

      const fn = map[combo]
      if (fn) {
        evt.preventDefault()
        fn()
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [shortCuts, actionMap])
}
