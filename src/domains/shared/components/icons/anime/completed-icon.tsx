import type { IconProps } from '@shared/types'

/**
 * CompletedIcon component renders an icon representing a completed status.
 *
 * @description This component displays a checkmark icon that symbolizes a completed or finished state.
 * The icon is designed to be used in anime detail pages or listings where completion status is displayed.
 * The component uses SVG paths to create a visually consistent icon that matches the application's
 * design system.
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
 * @returns {JSX.Element} The rendered SVG icon representing a completed status
 *
 * @example
 * <CompletedIcon className="w-6 h-6 text-green-500" />
 */
export const CompletedIcon = ({ className }: IconProps) => {
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
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}
