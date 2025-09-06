import { AnimeBanner } from '@components/anime-info/anime-banner'
import { AnimeDetails } from '@components/anime-info/anime-details'
import { AnimeLoader } from '@components/anime-info/anime-loader'
import { AnimeShowBox } from '@components/anime-info/anime-show-box'
import { SimilarToComponet } from '@components/anime-info/anime-similar-to'
import { AnimeTag } from '@components/anime-info/anime-tag'
import { AddToListButton } from '@components/buttons/add-to-list-button'
import { ShareButton } from '@components/buttons/share-button'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { Aside } from '@components/shared/Aside'
import { Header } from '@components/shared/Header'
import { InfoPageLayout } from '@components/shared/InfoPageLayout'
import { useBlockedContent } from '@hooks/useBlockedContent'
import { baseUrl } from '@utils/base-url'
import { getAnimeData } from '@utils/get-anime-data'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'
import { normalizeString } from '@utils/normalize-string'

/**
 * Props interface for the AnimeInfo component
 */
interface Props {
  /** The anime slug in format 'title_id' (e.g., 'one-piece_21') */
  slug: string
}

/**
 * AnimeInfo component displays detailed information about a specific anime.
 *
 * @summary
 * A comprehensive anime information page component that shows anime details,
 * handles parental control blocking, and provides interactive features.
 *
 * @description
 * This component fetches and displays detailed anime information including
 * banner, poster, synopsis, genres, characters, music, and related content.
 * It handles parental control restrictions and provides a modal for blocked
 * content with options to adjust settings or go back.
 *
 * The component uses the useBlockedContent hook to manage:
 * - Data fetching and loading states
 * - Parental control blocking logic
 * - Modal management for blocked content
 * - Navigation handling
 *
 * @features
 * - Responsive design with mobile-first approach
 * - Parental control integration
 * - Interactive anime details (trailer, characters, music)
 * - Social sharing capabilities
 * - Add to list functionality
 * - Watch anime button
 * - Similar anime recommendations
 *
 * @param {Props} props - The component props
 * @param {string} props.slug - The anime slug in format 'title_id'
 * @returns {JSX.Element} The rendered anime information page
 *
 * @example
 * // Usage in a page
 * <AnimeInfo slug="one-piece_21" />
 */
export const AnimeInfo = ({ slug }: Props) => {
  const { animeData, isBlocked, isLoading, isMounted } = useBlockedContent({
    slug,
    getAnimeData,
  })

  if (!isMounted || isLoading) {
    return <AnimeLoader />
  }

  if (isBlocked) {
    return <AnimeLoader />
  }

  if (!animeData) {
    return <AnimeLoader />
  }

  const url = `/anime/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const watchNowUrl = `/watch/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const shareText = `Watch ${animeData.title} on AniDev`

  return (
    <InfoPageLayout
      banner={
        <AnimeBanner
          banner_image={animeData.banner_image ?? ''}
          image_large_webp={
            animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
          }
          title={animeData.title}
        />
      }
    >
      <Aside
        title={animeData.title}
        posterImage={animeData.image_large_webp ?? ''}
        smallImage={animeData.image_small_webp ?? ''}
        bannerImage={animeData.banner_image ?? ''}
      >
        <WatchAnimeButton url={watchNowUrl} title={animeData.title} />
        <AddToListButton
          animeId={animeData.mal_id}
          anime_title={animeData.title}
          styles="button-secondary "
        />
        <ShareButton
          title={animeData.title}
          url={url}
          text={shareText}
          className="button-secondary"
        />
      </Aside>
      <Header title={animeData.title}>
        <AnimeTag
          tag={getAnimeType(animeData.type ?? '')}
          type={animeData.type ?? ''}
        />
        {animeData.genres?.map((genre: string) => (
          <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
        ))}
        {animeData.rating && (
          <AnimeTag
            tag={normalizeRating(animeData.rating)}
            type={normalizeString(animeData.rating)}
          />
        )}
      </Header>
      <div className="xl:col-span-3 col-span-1 md:col-span-2 flex flex-col gap-6">
        <AnimeShowBox
          animeId={animeData.mal_id}
          trailer_url={animeData.trailer_url ?? ''}
          banner_image={animeData.banner_image}
          image_large_webp={
            animeData.image_large_webp
          }
          image={animeData.image_webp}
          image_small_webp={
            animeData.image_small_webp
          }
          title={animeData.title}
          synopsis={animeData.synopsis ?? 'No synopsis available'}
        />
        <SimilarToComponet title={animeData.title} mal_id={animeData.mal_id} />
      </div>
      <AnimeDetails animeData={animeData} />
    </InfoPageLayout>
  )
}
