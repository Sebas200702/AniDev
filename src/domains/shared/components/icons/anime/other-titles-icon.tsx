import type { IconProps } from 'types'

/**
 * OtherTitlesIcon component renders an icon representing alternative titles for anime content.
 *
 * @description This component displays a globe-like icon that visually represents the concept of
 * alternative or multiple titles for anime. The SVG icon features a circular shape with horizontal
 * and vertical lines representing latitude and longitude, symbolizing global or international naming
 * variations. The component is designed to be lightweight and adaptable to different UI contexts
 * through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it to
 * adapt to various UI color schemes seamlessly. The SVG paths are structured to create a clear
 * visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in anime detail pages, metadata sections, or anywhere that alternative
 * titles need to be represented visually, providing users with a recognizable symbol for accessing
 * different naming conventions across regions.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered globe-like icon SVG representing alternative titles
 *
 * @example
 * <OtherTitlesIcon className="w-6 h-6 text-gray-500" />
 */
export const OtherTitlesIcon = ({ className }: IconProps) => {
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
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
      <path d="M3.6 9h16.8" />
      <path d="M3.6 15h16.8" />
      <path d="M11.5 3a17 17 0 0 0 0 18" />
      <path d="M12.5 3a17 17 0 0 1 0 18" />
    </svg>
  )
}
