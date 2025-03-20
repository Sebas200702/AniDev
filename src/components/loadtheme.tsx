import { useEffect } from 'react'

import { useGlobalUserPreferences } from '@store/global-user'

/**
 * LoadTheme component applies user-specific theme colors based on global preferences.
 *
 * This component does not render any UI elements.
 */
export const LoadTheme = () => {
  const enfasis = useGlobalUserPreferences((state) => state.enfasis)
  useEffect(() => {
    document.documentElement.style.setProperty('--color-enfasisColor', enfasis)
  }, [enfasis])
  return null
}
