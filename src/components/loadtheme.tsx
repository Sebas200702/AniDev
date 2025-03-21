import { useEffect } from 'react'
import { useGlobalUserPreferences } from '@store/global-user'

/**
 * LoadTheme component applies user-specific theme colors based on global preferences.
 *
 * @description This component manages the application's theme by dynamically setting CSS variables
 * based on user preferences. It doesn't render any visible UI elements but works in the background
 * to apply the selected emphasis color to the document root. The component listens for changes to
 * the user's color preferences and updates the theme accordingly without requiring page reloads.
 *
 * The component accesses the global user preferences store to retrieve the current emphasis color
 * selection. When this preference changes, the component updates the CSS custom property
 * '--color-enfasisColor' on the document's root element, which cascades throughout the application
 * styling. This approach enables seamless theme switching without disrupting the user experience.
 *
 * As this component returns null, it can be placed anywhere in the component tree without affecting
 * the layout or structure of the application.
 *
 * @returns {null} This component doesn't render any visible elements
 *
 * @example
 * <LoadTheme />
 */
export const LoadTheme = () => {
  const enfasis = useGlobalUserPreferences((state) => state.enfasis)
  useEffect(() => {
    document.documentElement.style.setProperty('--color-enfasisColor', enfasis)
  }, [enfasis])
  return null
}
