import type { IconProps } from '@shared/types'
/**
 * EpisodeIcon component renders an icon representing an episode or media content.
 *
 * @description This component displays a simplified video player or device screen icon that visually
 * represents episodes or media content. The SVG icon features a recognizable screen or player shape
 * with side controls, making it intuitive for users to identify episode-related functionality.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in media interfaces, episode listings, video players, or anywhere
 * that episodes or video content need to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered episode icon SVG
 *
 * @example
 * <EpisodeIcon className="w-6 h-6 text-gray-500" />
 */
export const EpisodeIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 5m0 1a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1z" />
      <path d="M22 17h-1a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h1" />
      <path d="M2 17h1a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1h-1" />
    </svg>
  )
}
