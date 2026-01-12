import { useEffect, useState } from 'react'
import type { AnimeEpisode } from '@watch/types'

/**
 * Custom hook for auto-scrolling to current episode
 * 
 * Automatically scrolls to the current episode when:
 * - Episodes data is loaded
 * - Current episode changes
 * - Initial page load
 */
export const useEpisodeScroll = (
  episodes: AnimeEpisode[],
  currentEpisode?: number
) => {
  const [shouldScroll, setShouldScroll] = useState(true)

  useEffect(() => {
    if (!shouldScroll || !episodes.length || !currentEpisode) return

    const scrollToEpisode = () => {
      const episodesList = document.querySelector('.anime-list')
      const targetEpisode = document.querySelector(
        `.anime-list a[href*="ep=${currentEpisode}"]`
      ) as HTMLAnchorElement

      if (!episodesList || !targetEpisode) return

      const offsetTop = targetEpisode.offsetTop
      episodesList.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      })
      
      setShouldScroll(false)
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToEpisode, 100)
    return () => clearTimeout(timeoutId)
  }, [episodes, currentEpisode, shouldScroll])

  return { setShouldScroll }
}
