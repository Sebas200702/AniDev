import type { IconProps } from '@shared/types'

/**
 * FallIcon component renders an icon representing the fall season.
 *
 * @description This component displays a maple leaf icon that visually represents the fall season
 * in anime seasonal categorization. The SVG icon features a recognizable leaf shape with stems,
 * making it intuitive for users to identify fall-related content. The component is designed to be
 * lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a fall leaf that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in seasonal anime navigation, filtering interfaces, or
 * anywhere that fall season content needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered fall season icon SVG
 *
 * @example
 * <FallIcon className="w-6 h-6 text-amber-500" />
 */
export const FallIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M12.014 21.514v-3.75M5.93 9.504l-.43 1.604a4.986 4.986 0 0 0 3.524 6.105c.997.268 1.993.535 2.99.801v-3.44a4.983 4.983 0 0 0-3.676-4.426L5.93 9.504z" />
      <path d="M13.744 11.164a4.903 4.903 0 0 0 1.433-3.46 4.884 4.884 0 0 0-1.433-3.46l-1.73-1.73-1.73 1.73a4.912 4.912 0 0 0-1.433 3.46 4.894 4.894 0 0 0 1.433 3.46" />
      <path d="m18.099 9.504.43 1.604a4.986 4.986 0 0 1-3.525 6.105l-2.99.801v-3.44a4.983 4.983 0 0 1 3.677-4.426l2.408-.644z" />
    </svg>
  )
}
