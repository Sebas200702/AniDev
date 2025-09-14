import type { IconProps } from '@shared/types'
/**
 * EmailIcon component renders an icon representing an email.
 *
 * @description This component renders an SVG icon that visually represents an email or message.
 * It features an envelope design with a simple and clean outline style that works well in various
 * UI contexts such as contact forms, user profiles, or notification systems.
 *
 * The icon is designed with accessibility in mind, using semantic SVG attributes and maintaining
 * good contrast. The stroke-based design ensures the icon remains crisp and legible at different
 * sizes while adapting to the current text color through the "currentColor" value.
 *
 * The component accepts a style prop that allows for customization of the icon's appearance
 * through CSS classes, enabling easy integration with different design systems and themes.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional CSS class name to customize the icon's appearance
 * @returns {JSX.Element} The rendered email icon SVG
 *
 * @example
 * <EmailIcon className="w-6 h-6 text-blue-500" />
 */
export const EmailIcon = ({ className }: IconProps) => (
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
    <path d="M0 0h24v24H0z" stroke="none"></path>
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path>
    <path d="m3 7 9 6 9-6"></path>
  </svg>
)
