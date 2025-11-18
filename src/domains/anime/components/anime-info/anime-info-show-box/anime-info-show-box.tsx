import { CharacterSection } from '@anime/components/anime-characters/anime-characters'
import { AnimeDescription } from '@anime/components/anime-info/anime-info-description'
import { AnimeNavBar } from '@anime/components/anime-info/anime-info-nav-bar'
import { AnimeRelatedContainer } from '@anime/components/anime-info/anime-info-related/anime-info-related-container'
import { AnimeTrailer } from '@anime/components/anime-info/anime-info-trailer'
import { AnimeMusicContainer } from '@anime/components/anime-music/anime-music-container'
import { MainInfo } from 'domains/shared/components/layout/base/MainInfo'

interface Props {
  animeId: number
  trailer_url: string
  banner_image: string
  image_large_webp: string
  image_small_webp: string
  image: string
  title: string
  synopsis: string
  currentSelectedLabel?: string
  isContentLoading: boolean
  contentKey: number
}

/**
 * Componente puramente presentacional que renderiza el contenido según la pestaña seleccionada.
 */
export const AnimeShowBox = ({
  animeId,
  trailer_url,
  banner_image,
  image_large_webp,
  image_small_webp,
  image,
  title,
  synopsis,
  currentSelectedLabel,
  isContentLoading,
  contentKey,
}: Props) => {
  const renderContent = () => {
    switch (currentSelectedLabel) {
      case 'Trailer':
        return (
          <AnimeTrailer
            trailer_url={trailer_url}
            banner_image={banner_image ?? image_large_webp}
            title={title}
          />
        )
      case 'Characters':
        return <CharacterSection animeId={animeId} />
      case 'Music':
        return (
          <AnimeMusicContainer
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
        return <AnimeRelatedContainer animeId={animeId} />
      default:
        return <AnimeDescription synopsis={synopsis} />
    }
  }

  return (
    <MainInfo>
      <div className="md:from-Primary-950/20 md:to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 md:from-Primary-950/80 md:to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-4 backdrop-blur-md">
        <AnimeNavBar />
      </div>

      <div
        className={`no-scrollbar relative z-10 max-h-[400px] md:aspect-video md:max-h-full ${
          currentSelectedLabel === 'Trailer'
            ? 'aspect-video overflow-y-hidden'
            : 'overflow-y-scroll'
        }`}
      >
        {isContentLoading ? (
          <div className="h-full animate-pulse space-y-4"></div>
        ) : (
          <div
            key={contentKey}
            className="animate-fadeIn h-full transition-all duration-300 ease-out"
            style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
          >
            {renderContent()}
          </div>
        )}
      </div>

      <div className="via-enfasisColor/20 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
    </MainInfo>
  )
}
