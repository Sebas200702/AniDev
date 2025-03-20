import { PlayIcon } from '@components/icons/play-icon'

/**
 * WatchAnimeButton component renders a button to watch an anime.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.url - The URL to navigate to when the button is clicked.
 */
export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      className="button-primary text-s flex w-full items-center justify-center gap-2"
    >
      <PlayIcon className="h-3 w-3 xl:h-4 xl:w-4" />
      Watch Now
    </a>
  )
}
