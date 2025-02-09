import { useEffect } from 'react'

import { useGlobalUserPreferences } from '@store/global-user'

export const LoadTheme = () => {
  const enfasis = useGlobalUserPreferences((state) => state.enfasis)
  useEffect(() => {
    document.documentElement.style.setProperty('--color-enfasisColor', enfasis)
  }, [enfasis])
  return null
}
