import type { IconProps } from 'types'

/**
 * HistoryIcon component renders an icon representing search history.
 *
 * @description This component displays a clock with a counterclockwise arrow icon that visually represents
 * history or past searches. The icon is designed to be used in search interfaces where users can access
 * their search history. The component uses SVG paths to create a visually consistent icon that matches
 * the application's design system.
 *
 * The icon is fully customizable through the className prop, allowing for different sizes,
 * colors, and other styling options based on the context where it's used. The SVG is configured
 * with appropriate viewBox and stroke properties to ensure crisp rendering at any size.
 *
 * All SVG paths use the currentColor value, which means the icon will inherit the text color
 * from its parent element, making it easy to integrate with different color schemes and themes.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for styling the icon
 * @returns {JSX.Element} The rendered SVG icon representing search history
 *
 * @example
 * <HistoryIcon className="w-6 h-6 text-gray-500" />
 */
export const HistoryIcon = ({ className }: IconProps) => {
  return (
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
      <path d="M12 8v4l2 2" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
  )
}
