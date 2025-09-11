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
export const AddToListIcon = ({ className }: IconProps) => (
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
    <path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
    <path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" />
    <path d="M11 10h6" />
    <path d="M14 7v6" />
    
  </svg>
)
