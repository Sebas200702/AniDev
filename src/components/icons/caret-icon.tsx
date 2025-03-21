import type { IconProps } from "types"
/**
 * CaretIcon component renders a caret icon for indicating direction.
 *
 * @description This component provides a simple, customizable caret (downward-pointing triangle) icon
 * that can be used in UI elements such as dropdowns, expandable sections, or navigation components.
 * The icon is implemented as an SVG with proper accessibility attributes and consistent styling.
 *
 * The SVG uses clean, geometric lines with appropriate stroke settings to ensure clear visibility
 * at different sizes. The icon inherits the current text color through the "currentColor" setting,
 * allowing it to adapt to various UI color schemes without modification.
 *
 * The component accepts a className prop that allows for custom styling, including size adjustments,
 * color changes, and transformations (such as rotation for different directional indicators).
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling
 * @returns {JSX.Element} The rendered caret icon SVG
 *
 * @example
 * <CaretIcon className="w-4 h-4 text-gray-500" />
 */
export const CaretIcon = ({ className }: IconProps) => {
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
      <path d="m6 10 6 6 6-6H6" />
    </svg>
  )
}
