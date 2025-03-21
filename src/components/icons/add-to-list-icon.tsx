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
    fill="currentColor"
    className={className}
    viewBox="0 0 32 32"
  >
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M4.929 4.929A10 10 0 1 1 19.07 19.07 10 10 0 0 1 4.93 4.93zM13 9a1 1 0 1 0-2 0v2H9a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2V9z"></path>
  </svg>
)
