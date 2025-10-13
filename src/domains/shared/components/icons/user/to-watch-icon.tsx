import type { IconProps } from '@shared/types'

/**
 * ToWatchIcon component renders an icon representing a bookmark or "to watch" functionality.
 *
 * @description This component displays a bookmark icon that visually represents content a user
 * might want to save for later viewing. The SVG icon features a recognizable bookmark shape,
 * making it intuitive for users to identify "watch later" or "save" functionality. The component
 * is designed to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a bookmark that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in content listing interfaces, media galleries, or anywhere
 * that saving content for later viewing needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered bookmark icon SVG
 *
 * @example
 * <ToWatchIcon className="w-6 h-6 text-gray-500" />
 */
export const ToWatchIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M18 7v14l-6-4-6 4V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4z" />
    </svg>
  )
}
