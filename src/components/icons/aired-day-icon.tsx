import type { IconProps } from 'types'
/**
 * AiredDayIcon component renders an icon representing the day an anime aired.
 *
 * @description This component displays a calendar icon with a clock element to visually represent
 * the broadcast day of an anime series. The icon combines calendar and time elements to effectively
 * communicate the concept of a specific airing day. The SVG is designed with clean lines and
 * recognizable shapes that convey the intended meaning clearly.
 *
 * The component uses the standard SVG structure with appropriate viewBox and stroke settings to
 * ensure consistent rendering across different sizes. The icon inherits the current text color
 * through the "currentColor" setting, allowing it to adapt to various UI color schemes without
 * modification.
 *
 * The SVG paths are carefully structured to create a calendar base with a clock element, providing
 * a visual representation that is immediately recognizable as representing a day-specific schedule.
 *
 * @param {IconProps} props - Component props
 * @param {string} [props.className] - Optional class name for styling the SVG element
 * @returns {JSX.Element} The rendered calendar with clock icon SVG
 *
 * @example
 * <AiredDayIcon className="w-6 h-6 text-gray-500" />
 */
export const AiredDayIcon = ({ className }: IconProps): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
      <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M15 3v4" />
      <path d="M7 3v4" />
      <path d="M3 11h16" />
      <path d="M18 16.496v1.504l1 1" />
    </svg>
  )
}
