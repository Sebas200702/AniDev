import type { IconProps } from 'types'

/**
 * AddToListIcon component renders an icon for adding an item to a list.
 *
 * @description This component displays a plus icon inside a circle, commonly used for "add to list"
 * functionality in user interfaces. The icon is designed with a minimalist style using SVG paths.
 * It renders as a circular button with a plus sign in the center, providing clear visual feedback
 * for add operations.
 *
 * The component accepts an optional class prop that allows for custom styling through CSS classes.
 * The SVG uses currentColor for fill, allowing the icon color to be controlled through CSS color
 * properties of parent elements.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional CSS class name for styling the icon
 * @returns {JSX.Element} The rendered SVG icon with appropriate styling
 *
 * @example
 * <AddToListIcon className="w-6 h-6 text-blue-500" />
 */
export const AddToListIcon = ({ className }: IconProps): JSX.Element => (
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
    <path d="M19 8H5M5 12h9M11 16H5M15 16h6M18 13v6" />
  </svg>
)
