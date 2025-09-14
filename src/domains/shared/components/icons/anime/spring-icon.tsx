import type { IconProps } from '@shared/types'

/**
 * SpringIcon component renders an icon representing a spring or seasonal anime.
 *
 * @description This component displays a stylized spring icon that visually represents seasonal
 * anime or spring-related content. The SVG icon features curved lines resembling a sprouting plant
 * or spring coil, making it intuitive for users to identify spring-themed or seasonal content.
 * The component is designed to be lightweight and adaptable to different UI contexts through
 * customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in seasonal anime listings, content organization interfaces, or
 * anywhere that spring-themed or seasonal content needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered spring icon SVG
 *
 * @example
 * <SpringIcon className="w-6 h-6 text-green-500" />
 */
export const SpringIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M5 21c.5-4.5 2.5-8 7-10" />
      <path d="M9 18c6.218 0 10.5-3.288 11-12V4h-4.014c-9 0-11.986 4-12 9 0 1 0 3 2 5h3z" />
    </svg>
  )
}
