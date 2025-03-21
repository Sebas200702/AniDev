import type { IconProps } from 'types'

/**
 * ClockIcon component renders an icon representing a clock.
 *
 * @description This component displays a clock icon using SVG paths to create a visually
 * recognizable representation of time. The icon features a circular clock face with hour
 * and minute hands positioned to show a specific time. The SVG is designed with
 * clean lines and a recognizable shape that clearly communicates time-related functionality.
 *
 * The component uses the standard SVG structure with appropriate viewBox and stroke settings to
 * ensure consistent rendering across different sizes. The icon inherits the current text color
 * through the "currentColor" setting, allowing it to adapt to various UI color schemes without
 * modification.
 *
 * The SVG paths are carefully structured to create a clock face with hands pointing to
 * approximately 7:15, providing a visual representation that is immediately recognizable
 * as a time indicator.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for styling the SVG element
 * @returns {JSX.Element} The rendered clock icon SVG
 *
 * @example
 * <ClockIcon className="w-6 h-6 text-gray-500" />
 */
export const ClockIcon = ({ className }: IconProps) => (
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
    <path d="M0 0h24v24H0z" stroke="none"></path>
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
    <path d="M12 7v5l3 3"></path>
  </svg>
)
