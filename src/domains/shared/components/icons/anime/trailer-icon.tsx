import type { IconProps } from '@shared/types'

/**
 * TrailerIcon component renders an SVG icon representing a video trailer.
 *
 * @description This component displays a trailer or video player icon that visually represents
 * multimedia content. The SVG icon features a recognizable video player shape with a play button,
 * making it intuitive for users to identify video or trailer-related functionality. The component
 * is designed to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a video player that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in media galleries, anime detail pages, or anywhere that video
 * content needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered trailer icon SVG
 *
 * @example
 * <TrailerIcon className="w-6 h-6 text-gray-500" />
 */
export const TrailerIcon = ({ className }: IconProps) => (
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
    <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
    <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
  </svg>
)
