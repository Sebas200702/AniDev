import { CharacterSection } from '@components/anime-info/anime-characters'
import { AnimeDescription } from '@components/anime-info/anime-description'
import { AnimeMusic } from '@components/anime-info/anime-music'
import { AnimeNavBar } from '@components/anime-info/anime-nav-bar'
import { AnimeRelated } from '@components/anime-info/anime-related'
import { AnimeTrailer } from '@components/anime-info/anime-trailer'
import { useAnimeListsStore } from '@store/anime-list-store'
import { useEffect, useState } from 'react'

/**
 * AnimeShowBox component displays content based on the selected tab for an anime.
 *
 * @description This component manages the display of different content sections for an anime
 * based on user selection. It dynamically renders the appropriate component according to the
 * currently selected tab (Synopsis, Trailer, Characters, Music, Related). The component uses
 * smooth transitions, modern visual effects, and responsive design for an enhanced user experience.
 *
 * Features modern design improvements:
 * - Smooth fade transitions between content sections
 * - Gradient borders and backgrounds
 * - Enhanced visual hierarchy with better spacing
 * - Loading states with skeleton animations
 * - Responsive design optimized for all screen sizes
 * - Accessibility improvements with proper ARIA labels
 *
 * @param {Props} props - The component props
 * @param {number} props.animeId - The unique identifier of the anime
 * @param {string} props.trailer_url - The URL of the anime trailer
 * @param {string} props.banner_image - The banner image of the anime
 * @param {string} props.image_large_webp - The large webp image of the anime
 * @param {string} props.image_small_webp - The small webp image of the anime
 * @param {string} props.image - The standard image of the anime
 * @param {string} props.title - The title of the anime
 * @param {string} props.synopsis - The synopsis of the anime
 * @returns {JSX.Element} The rendered content based on the selected tab
 */
interface Props {
  animeId: number
  trailer_url: string
  banner_image: string
  image_large_webp: string
  image_small_webp: string
  image: string
  title: string
  synopsis: string
}

export const AnimeShowBox = ({
  animeId,
  trailer_url,
  banner_image,
  image_large_webp,
  image_small_webp,
  image,
  title,
  synopsis,
}: Props) => {
  const { animeList } = useAnimeListsStore()
  const currentSelected = animeList.find((section) => section.selected)
  const currentSelectedLabel = currentSelected?.label
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [contentKey, setContentKey] = useState(0)

  useEffect(() => {
    setIsContentLoading(true)
    const timer = setTimeout(() => {
      setIsContentLoading(false)
      setContentKey((prev) => prev + 1)
    }, 150)

    return () => clearTimeout(timer)
  }, [currentSelectedLabel])

  const renderContent = () => {
    switch (currentSelectedLabel) {
      case 'Trailer':
        return (
          <AnimeTrailer
            trailer_url={trailer_url}
            banner_image={banner_image}
            image_large_webp={image_large_webp}
            title={title}
          />
        )
      case 'Characters':
        return <CharacterSection animeId={animeId} />
      case 'Music':
        return (
          <AnimeMusic
            animeId={animeId}
            image={image}
            placeholder={image_small_webp}
            banner_image={banner_image}
            anime_title={title}
          />
        )
      case 'Synopsis':
        return <AnimeDescription synopsis={synopsis} />
      case 'Related':
        return <AnimeRelated animeId={animeId} />
    }
  }

  return (
    <section
      className="border-Primary-800/30 from-Complementary via-Primary-950 to-Complementary/95 hover:border-Primary-700/50 relative z-10 flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br shadow-2xl backdrop-blur-sm transition-all duration-500 ease-in-out hover:shadow-xl"
      role="tabpanel"
      aria-labelledby={`tab-${currentSelectedLabel?.toLowerCase()}`}
    >
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-4 backdrop-blur-md">
        <AnimeNavBar />
      </div>

      <div
        className={`no-scrollbar relative z-10 aspect-video ${currentSelectedLabel === 'Trailer' ? 'overflow-y-hidden' : 'overflow-y-scroll'}`}
      >
        {isContentLoading ? (
          <div className="h-full animate-pulse space-y-4"></div>
        ) : (
          <div
            key={contentKey}
            className="animate-fadeIn h-full transition-all duration-300 ease-out"
            style={{
              animation: 'fadeIn 0.4s ease-out forwards',
            }}
          >
            {renderContent()}
          </div>
        )}
      </div>

      <div className="via-enfasisColor/20 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
    </section>
  )
}
