import type { IconProps } from '@shared/types'

/**
 * WatchingIcon component renders an eye icon representing a watching or visibility state.
 *
 * @description This component displays an SVG eye icon that visually represents watching or
 * visibility status. The icon features a simple, recognizable eye design with a pupil in the
 * center and outer eye shape. The SVG paths create a clean visual representation that works
 * well at different sizes while maintaining clarity.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The component is designed to be lightweight
 * and adaptable to different UI contexts through the optional className prop for custom styling.
 *
 * This icon is typically used in user interface elements related to visibility toggles,
 * watching status indicators, or view-related actions.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered eye icon SVG
 *
 * @example
 * <WatchingIcon className="w-6 h-6 text-blue-500" />
 */
export const WatchingIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
      <path d="M21 12c-2.4 4-5.4 6-9 6-3.6 0-6.6-2-9-6 2.4-4 5.4-6 9-6 3.6 0 6.6 2 9 6" />
    </svg>
  )
}
