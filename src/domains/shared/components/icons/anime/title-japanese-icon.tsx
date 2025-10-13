import type { IconProps } from '@shared/types'

/**
 * TitleJapaneseIcon component renders an icon representing Japanese title text.
 *
 * @description This component displays an SVG icon that visually represents Japanese text or titles.
 * The icon features stylized characters that resemble Japanese writing, making it intuitive for users
 * to identify Japanese title-related information. The component is designed to be lightweight and
 * adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of Japanese characters that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in anime information displays, language selection interfaces, or
 * anywhere that Japanese titles or text need to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered Japanese title icon SVG
 *
 * @example
 * <TitleJapaneseIcon className="w-6 h-6 text-gray-500" />
 */
export const TitleJapaneseIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8" />
      <path d="M5 9c0 2.144 2.952 3.908 6.7 4M12 20l4-9 4 9M19.1 18h-6.2" />
    </svg>
  )
}
