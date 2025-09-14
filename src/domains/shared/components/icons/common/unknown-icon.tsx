import type { IconProps } from '@shared/types'

/**
 * UnknownIcon component renders an icon representing an unknown or help state.
 *
 * @description This component displays a question mark icon that visually represents help,
 * unknown status, or information requests. The SVG icon features a document or note-like shape
 * with a question mark, making it intuitive for users to identify help or unknown-related functionality.
 * The component is designed to be lightweight and adaptable to different UI contexts through
 * customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in help sections, unknown states, or anywhere that requires
 * indicating that something is unknown or needs clarification.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered unknown/question mark icon SVG
 *
 * @example
 * <UnknownIcon className="w-6 h-6 text-gray-500" />
 */
export const UnknownIcon = ({ className }: IconProps) => (
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
    <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 16v.01" />
    <path d="M12 13a2 2 0 0 0 .914-3.782 1.98 1.98 0 0 0-2.414.483" />
  </svg>
)
