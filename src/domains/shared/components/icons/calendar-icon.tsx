import type { IconProps } from 'types'
/**
 * CalendarIcon component renders an icon representing a calendar.
 *
 * @description This component displays a calendar icon using SVG paths to create a visually
 * recognizable representation of a calendar. The icon features a calendar outline with date
 * markers to effectively communicate date-related functionality. The SVG is designed with
 * clean lines and a recognizable shape that conveys the intended meaning clearly.
 *
 * The component uses the standard SVG structure with appropriate viewBox and stroke settings to
 * ensure consistent rendering across different sizes. The icon inherits the current text color
 * through the "currentColor" setting, allowing it to adapt to various UI color schemes without
 * modification.
 *
 * The SVG paths are carefully structured to create a calendar with date dots, providing
 * a visual representation that is immediately recognizable as a calendar interface element.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for styling the SVG element
 * @returns {JSX.Element} The rendered calendar icon SVG
 *
 * @example
 * <CalendarIcon className="w-6 h-6 text-gray-500" />
 */
export const CalendarIcon = ({ className }: IconProps) => {
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
      <path d="M0 0h24v24H0z" stroke="none"></path>
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zM16 3v4M8 3v4M4 11h16M7 14h.013M10.01 14h.005M13.01 14h.005M16.015 14h.005M13.015 17h.005M7.01 17h.005M10.01 17h.005"></path>
    </svg>
  )
}
