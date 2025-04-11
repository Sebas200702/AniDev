import { PlayIcon } from '@components/icons/play-icon'

/**
 * WatchAnimeButton component renders a button to watch an anime.
 *
 * @description This component provides a prominent call-to-action button for users to start watching
 * an anime. It creates a visually appealing button with a play icon and descriptive text to clearly
 * indicate the action. The button is styled with the primary button class for visual emphasis and
 * consistent branding.
 *
 * The component is designed to be responsive, with the icon size adjusting based on screen size
 * for optimal viewing across devices. The button spans the full width of its container, making it
 * easy to tap on mobile devices while maintaining a consistent layout on larger screens.
 *
 * When clicked, the button navigates the user to the specified URL where they can watch the anime.
 * The component uses a semantic anchor element to ensure proper accessibility and SEO benefits.
 *
 * @param {Object} props - The component props
 * @param {string} props.url - The URL to navigate to when the button is clicked
 * @returns {JSX.Element} The rendered watch button with play icon and text
 *
 * @example
 * <WatchAnimeButton url="/watch/my-hero-academia_31964" />
 */
export const WatchAnimeButton = ({
  url,
  title,
}: { url: string; title: string }) => {
  return (
    <a
      href={url}
      className="button-primary text-m flex w-full items-center justify-center gap-2"
      title={`Watch ${title}`}
    >
      <PlayIcon className="h-3 w-3 xl:h-4 xl:w-4" />
      Watch Now
    </a>
  )
}
