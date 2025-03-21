import type { IconProps } from "types"

/**
 * StudioIcon component displays an SVG icon representing an anime studio.
 *
 * @description This component renders an SVG icon that visually represents a studio or production company.
 * The icon features a building-like structure with windows, symbolizing a production studio.
 * It uses the currentColor value for stroke color, allowing it to inherit color from parent elements.
 * The icon maintains consistent stroke width and line join/cap styles for a clean appearance.
 *
 * The component accepts an optional className prop that allows for custom styling and sizing
 * when used in different contexts. This makes the icon highly adaptable to various UI requirements
 * and responsive designs.
 *
 * The SVG paths are optimized for clarity and consistent rendering across different screen sizes.
 * The icon includes a hidden path that defines the viewBox boundaries and visible paths that create
 * the studio building representation with windows and structural elements.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional CSS class name to apply custom styling to the icon
 * @returns {JSX.Element} The rendered SVG icon with appropriate attributes and styling
 *
 * @example
 * <StudioIcon className="w-6 h-6 text-gray-500" />
 */
export const StudioIcon = ({ className }: IconProps) => {
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
      <path d="M4 21V6c0-1 1-2 2-2h5c1 0 2 1 2 2v15M16 8h2c1 0 2 1 2 2v11M3 21h18M10 12v0M10 16v0M10 8v0M7 12v0M7 16v0M7 8v0M17 12v0M17 16v0" />
    </svg>
  )
}
