import type { IconProps } from '@shared/types'

/**
 * MoreOptionsIcon component renders an icon representing additional options.
 *
 * @description This component displays a vertical ellipsis (three dots) icon that visually represents
 * more options or actions available to the user. The SVG icon uses simple circular paths to create
 * a clean, recognizable "more options" symbol that follows common UI patterns. The component is designed
 * to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in menus, lists, cards, or any interface element where additional
 * actions are available but hidden to reduce visual clutter. When clicked, it usually triggers
 * a dropdown menu or action sheet with the available options.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered more options icon SVG
 *
 * @example
 * <MoreOptionsIcon className="w-6 h-6 text-gray-500" />
 */
export const MoreOptionsIcon = ({ className }: IconProps) => {
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
      <path d="M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 19a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 5a1 1 0 1 0 2 0 1 1 0 1 0-2 0" />
    </svg>
  )
}
