import { AnimeBanner } from '@anime/components/anime-info/anime-banner'
import { AnimeDetails } from '@anime/components/anime-info/anime-details'
import { AnimeLoader } from '@anime/components/anime-info/anime-loader'
import { AnimeShowBox } from '@anime/components/anime-info/anime-show-box'
import { SimilarToComponet } from '@anime/components/anime-info/anime-similar-to'
import { AnimeTag } from '@anime/components/shared/anime-tag'
import { AddToListButton } from '@shared/components/buttons/add-to-list-button'
import { ShareButton } from '@shared/components/buttons/share-button'
import { WatchAnimeButton } from '@shared/components/buttons/watch-anime'
import { useBlockedContent } from '@shared/hooks/useBlockedContent'
import { baseUrl } from '@utils/base-url'
import { getAnimeData } from '@utils/get-anime-data'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'
import { normalizeString } from '@utils/normalize-string'
import { Aside } from 'domains/shared/components/layout/base/Aside'
import { Header } from 'domains/shared/components/layout/base/Header'
import { InfoPageLayout } from 'domains/shared/components/layout/base/InfoPageLayout'

/**
 * Props interface for the AnimeInfo component
 */

interface Props {
  /** The numeric anime ID (e.g., 21) */
  id: number
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
export const AnimeInfo = ({ id }: Props) => {
  const { animeData, isBlocked, isLoading, isMounted } = useBlockedContent({
    id,
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
          banner_image={
            animeData.banner_image ??
            animeData.image_large_webp ??
            `${baseUrl}/placeholder.webp`
          }
          image_large_webp={
            animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
          }
          title={animeData.title}
        />
      }
    >
      <Aside
        title={animeData.title}
        posterImage={
          animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
        }
        smallImage={animeData.image_small_webp ?? `${baseUrl}/placeholder.webp`}
        bannerImage={animeData.banner_image ?? `${baseUrl}/placeholder.webp`}
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
      <div className="col-span-1 flex flex-col gap-10 md:col-span-2 xl:col-span-3">
        <AnimeShowBox
          animeId={animeData.mal_id}
          trailer_url={animeData.trailer_url ?? ''}
          banner_image={
            animeData.banner_image ??
            animeData.image_large_webp ??
            `${baseUrl}/placeholder.webp`
          }
          image_large_webp={
            animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
          }
          image={animeData.image_webp ?? `${baseUrl}/placeholder.webp`}
          image_small_webp={
            animeData.image_small_webp ?? `${baseUrl}/placeholder.webp`
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
