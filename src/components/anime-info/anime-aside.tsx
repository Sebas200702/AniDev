import type { Anime } from 'types'
import { Picture } from '@components/picture'
import { ShareButton } from '@components/buttons/share-button'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'

/**
 * AnimeAside component displays additional information about an anime in a sidebar format.
 *
 * This component takes in anime data, watch now URL, share text, and URL as props.
 * It displays the anime image, watch now button, and share button.
 *
 * @param {Object} props - The props for the component.
 * @param {Anime} props.animeData - The anime object containing details to display.
 * @param {string} props.watchNowUrl - The URL to watch the anime now.
 * @param {string} props.shareText - The text to share about the anime.
 * @param {string} props.url - The URL of the anime page.
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
    <aside className="anime-aside top-28 z-10 row-span-2 flex h-min w-full flex-col gap-8 p-4 md:items-start md:p-0 xl:sticky">
      <Picture
        image={createImageUrlProxy(
          animeData.image_large_webp,
          '100',
          '0',
          'webp'
        )}
        styles="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
      >
        <img
          className="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
          src={createImageUrlProxy(
            animeData.image_large_webp,
            '1920',
            '50',
            'webp'
          )}
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
