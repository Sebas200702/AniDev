import type { IconProps } from '@shared/types'

/**
 * ScoredByIcon component renders an icon representing the score given by a user.
 *
 * @description This component displays an SVG icon that visually represents user ratings or scores.
 * The icon combines a user silhouette with a star rating, symbolizing user-contributed scores for
 * anime content. The design features a person figure on the left side and a star on the right,
 * creating a clear visual association between users and ratings.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it to
 * adapt to various UI color schemes seamlessly. The SVG paths are structured to create a clear
 * visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in anime detail pages, rating sections, or anywhere that user
 * scores need to be represented visually, providing a recognizable symbol for accessing
 * user rating information.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered SVG icon representing user scores
 *
 * @example
 * <ScoredByIcon className="w-6 h-6 text-gray-500" />
 */
export const ScoredByIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h.5" />
      <path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" />
    </svg>
  )
}
