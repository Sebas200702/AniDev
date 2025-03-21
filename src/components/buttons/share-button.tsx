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
}

const ShareIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className="h-3 w-3 xl:h-4 xl:w-4"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M13 4v4C6.425 9.028 3.98 14.788 3 20c-.037.206 5.384-5.962 10-6v4l8-7-8-7z" />
    </svg>
  )
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
export const ShareButton = ({ title, url, text }: Props) => {
  const handleClick = () => {
    navigator.share({
      title,
      text,
      url,
    })
  }

  return (
    <button onClick={handleClick} className="button-secondary" title="Share">
      <ShareIcon />
    </button>
  )
}
