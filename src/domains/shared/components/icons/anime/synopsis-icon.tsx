import type { IconProps } from '@shared/types'

/**
 * SynopsisIcon component renders an icon representing a synopsis or text summary.
 *
 * @description This component displays a text alignment icon that visually represents a synopsis
 * or text summary. The SVG icon features three horizontal lines of decreasing length, mimicking
 * text paragraphs, making it intuitive for users to identify synopsis-related content. The component
 * is designed to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in anime detail pages, content descriptions, or anywhere that
 * synopsis or text summaries need to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered synopsis icon SVG
 *
 * @example
 * <SynopsisIcon className="w-6 h-6 text-gray-500" />
 */
export const SynopsisIcon = ({ className }: IconProps) => (
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
    <path d="M4 6l16 0" />
    <path d="M4 12l16 0" />
    <path d="M4 18l12 0" />
  </svg>
)
