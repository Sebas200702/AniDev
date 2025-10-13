import type { IconProps } from '@shared/types'
/**
 * CharacterIcon component renders an icon representing a character.
 *
 * @description This component displays an SVG icon that represents character profiles or users.
 * The icon shows a primary user figure with a secondary user silhouette, making it suitable for
 * displaying character lists, cast members, or user groups in anime-related interfaces.
 *
 * The SVG is configured with appropriate viewBox and stroke properties to ensure crisp rendering
 * at any size. The icon uses the currentColor value, which means it will inherit the text color
 * from its parent element, making it easy to integrate with different color schemes and themes.
 *
 * The component is fully customizable through the className prop, allowing for different sizes,
 * colors, and other styling options based on the context where it's used. This makes it versatile
 * for use in various parts of the application where character representation is needed.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling the icon
 * @returns {JSX.Element} The rendered SVG icon representing a character or user profile
 *
 * @example
 * <CharacterIcon className="w-6 h-6 text-gray-500" />
 */
export const CharacterIcon = ({ className }: IconProps) => (
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
    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </svg>
)
