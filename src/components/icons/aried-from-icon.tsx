import type { IconProps } from "types"

/**
 * AiredFromIcon component renders an icon representing the start date an anime aired.
 *
 * @description This component displays a calendar icon with a downward arrow, symbolizing the start date
 * of an anime's broadcast period. The icon is designed to be used in anime detail pages or listings
 * where airing information is displayed. The component uses SVG paths to create a visually
 * consistent icon that matches the application's design system.
 *
 * The icon is fully customizable through the className prop, allowing for different sizes,
 * colors, and other styling options based on the context where it's used. The SVG is configured
 * with appropriate viewBox and stroke properties to ensure crisp rendering at any size.
 *
 * All SVG paths use the currentColor value, which means the icon will inherit the text color
 * from its parent element, making it easy to integrate with different color schemes and themes.
 *
 * @param {IconProps} props - Component props
 * @param {string} [props.className] - Optional class name for styling the icon
 * @returns {JSX.Element} The rendered SVG icon representing an anime's start air date
 *
 * @example
 * <AiredFromIcon className="w-6 h-6 text-gray-500" />
 */
export const AiredFromIcon = ({ className }: IconProps): JSX.Element => {
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
      <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" />
      <path d="M19 16v6" />
      <path d="M22 19l-3 3l-3 -3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M4 11h16" />
    </svg>
  )
}
