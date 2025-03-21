import type { IconProps } from 'types'

/**
 * ThemesIcon component renders an icon representing themes or styles settings.
 *
 * @description This component displays a clipboard-like icon that visually represents theme
 * or style settings. The SVG icon features a recognizable document with list items, making it
 * intuitive for users to identify theme-related functionality. The component is designed to be
 * lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a theme settings document that works well at different
 * sizes while maintaining visual clarity.
 *
 * This icon is typically used in navigation menus, settings interfaces, or anywhere that
 * theme customization options need to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered themes icon SVG
 *
 * @example
 * <ThemesIcon className="w-6 h-6 text-gray-500" />
 */
export const ThemesIcon = ({ className }: IconProps) => {
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
      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
      <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
      <path d="M9 12l.01 0" />
      <path d="M13 12l2 0" />
      <path d="M9 16l.01 0" />
      <path d="M13 16l2 0" />
    </svg>
  )
}
