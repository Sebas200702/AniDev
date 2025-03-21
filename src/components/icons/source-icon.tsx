import type { IconProps } from "types"

/**
 * SourceIcon component renders an SVG icon representing a source or book.
 *
 * @description This component displays a book or document icon using SVG paths.
 * The icon represents a book with three vertical lines connected by curved lines at the top and bottom,
 * symbolizing pages or content sources. The icon is fully customizable through the className prop,
 * allowing for different sizes, colors, and styles to be applied based on the context.
 *
 * The SVG is designed with accessibility in mind, using semantic attributes and proper scaling.
 * It uses the currentColor value for stroke, which means it will inherit the text color from its parent,
 * making it easy to integrate with different color schemes and themes.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional CSS class name to apply custom styling to the icon
 * @returns {JSX.Element} The rendered source icon SVG
 *
 * @example
 * <SourceIcon className="w-6 h-6 text-blue-500" />
 */
export const SourceIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
      <path d="M3 6l0 13" />
      <path d="M12 6l0 13" />
      <path d="M21 6l0 13" />
    </svg>
  )
}
