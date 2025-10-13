import type { IconProps } from '@shared/types'

/**
 * StarIcon component renders a star-shaped icon for ratings and favorites.
 *
 * @description This component displays a star icon commonly used for rating systems,
 * favorites, or bookmarks. The SVG icon features a recognizable five-pointed star shape
 * that visually represents rating or favoriting functionality. The component is designed
 * to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a star that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in rating systems, favorites lists, or anywhere that starred
 * or favorited content needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered star icon SVG
 *
 * @example
 * <StarIcon className="w-6 h-6 text-yellow-500" />
 */
export const StarIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
  </svg>
)
