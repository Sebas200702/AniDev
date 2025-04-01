import { ShareButton } from '@components/buttons/share-button'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { Picture } from '@components/picture'
import type { Anime } from 'types'

/**
 * AnimeAside component displays additional information about an anime in a sidebar format.
 *
 * @description This component renders a sidebar containing the anime's image and action buttons.
 * It creates an optimized viewing experience by displaying a high-quality image of the anime
 * along with interactive elements for user engagement. The component uses the Picture component
 * for progressive image loading with different resolutions to improve performance.
 *
 * The sidebar is designed to be responsive, adjusting its layout based on screen size. On larger
 * screens, it becomes sticky to remain visible while the user scrolls through the main content.
 * The component provides two primary actions: a "Watch Now" button that directs users to view
 * the anime and a "Share" button that allows users to share the anime with others.
 *
 * The image is optimized using the createImageUrlProxy utility to generate appropriate sizes
 * for different loading stages, improving initial load times while ensuring high-quality visuals
 * when fully loaded.
 *
 * @param {Props} props - The component props
 * @param {Anime} props.animeData - The anime object containing details to display including image and title
 * @param {string} props.watchNowUrl - The URL to watch the anime now
 * @param {string} props.shareText - The text to share about the anime
 * @param {string} props.url - The URL of the anime page for sharing
 * @returns {JSX.Element} The rendered sidebar with anime image and action buttons
 *
 * @example
 * <AnimeAside
 *   animeData={animeData}
 *   watchNowUrl="/watch/my-anime-123"
 *   shareText="Check out this amazing anime!"
 *   url="https://example.com/anime/my-anime-123"
 * />
 */
interface Props {
  /**
   * The anime object containing details to display.
   */
  animeData: Anime
  /**
   * The URL to watch the anime now.
   */
  watchNowUrl: string
  /**
   * The text to share about the anime.
   */
  shareText: string
  /**
   * The URL of the anime page.
   */
  url: string
}

export const AnimeAside = ({
  animeData,
  watchNowUrl,
  shareText,
  url,
}: Props) => {
  return (
    <aside className="anime-aside top-28 z-10 row-span-2 mt-26 flex h-min w-full flex-col gap-8 px-10 md:mt-0 md:items-start md:p-0 xl:sticky">
      <Picture
        image={animeData.image_small_webp}
        styles="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out relative"
      >
        <img
          className="relative aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
          src={animeData.image_large_webp}
          alt={animeData.title}
          loading="lazy"
        />
      </Picture>

      <div className="flex h-full w-full flex-row justify-end gap-2">
        <WatchAnimeButton url={watchNowUrl} />
        <ShareButton title={animeData.title} url={url} text={shareText} />
      </div>
    </aside>
  )
}
