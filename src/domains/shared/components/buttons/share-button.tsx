import { ShareIcon } from '@shared/components/icons/common/share-icon'
interface Props {
  /**
   * The title of the anime to be shared.
   */
  title: string
  /**
   * The URL of the anime to be shared.
   */
  url: string
  /**
   * The text to be shared along with the anime.
   */
  text: string
  className: string
  label?: string
}

/**
 * ShareButton component renders a button to share an anime on social media.
 *
 * @description This component provides a sharing functionality for anime content.
 * It leverages the Web Share API to allow users to share anime information through
 * their device's native sharing capabilities. When clicked, the button opens the
 * system's share dialog with pre-populated anime information including title,
 * descriptive text, and a URL link to the anime.
 *
 * The component features a simple, accessible button with an icon that visually
 * indicates the sharing action. It's designed to be responsive with appropriate
 * sizing for different screen sizes through Tailwind CSS utility classes.
 *
 * The sharing functionality is implemented through the navigator.share() method,
 * which provides a consistent sharing experience across platforms that support
 * the Web Share API.
 *
 * @param {Props} props - The component props
 * @param {string} props.title - The title of the anime to be shared
 * @param {string} props.url - The URL of the anime page for sharing
 * @param {string} props.text - The descriptive text to share about the anime
 * @returns {JSX.Element} A button that triggers the share functionality when clicked
 *
 * @example
 * <ShareButton
 *   title="My Hero Academia"
 *   url="https://example.com/anime/my-hero-academia"
 *   text="Check out this amazing anime!"
 * />
 */
export const ShareButton = ({ title, url, text, className, label }: Props) => {
  const handleClick = () => {
    navigator.share({
      title,
      text,
      url,
    })
  }

  return (
    <button onClick={handleClick} className={className} title="Share">
      <ShareIcon className="h-4 w-4 md:h-5 md:w-5" />
      {label && <span className="font-medium">Share</span>}
    </button>
  )
}
