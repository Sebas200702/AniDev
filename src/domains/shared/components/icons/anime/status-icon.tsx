import type { IconProps } from '@shared/types'
import { statusColors } from '@utils/status-colors'

interface StatusIconProps extends IconProps {
  status: string | null | undefined
}
/**
 * StatusIcon component displays an SVG icon representing the airing status of an anime.
 *
 * @description This component renders different SVG icons based on the provided status string.
 * It uses the statusColors utility to apply appropriate coloring to each status icon.
 * The component handles three main states:
 * - "Currently Airing": Shows a broadcasting/signal icon
 * - "Not yet aired": Shows a disabled/crossed-out broadcasting icon
 * - All other statuses (e.g., "Finished Airing"): Shows a checkmark in a circle
 *
 * Each icon is styled consistently with the same SVG attributes while the paths
 * change to represent the different statuses visually. The component accepts
 * an optional className for additional styling customization.
 *
 * @param {StatusIconProps} props - The component props
 * @param {string} props.status - The anime status string that determines which icon to display
 * @param {string} [props.className] - Optional CSS class name for styling the SVG
 * @returns {JSX.Element} The SVG icon representing the anime's status
 *
 * @example
 * <StatusIcon status="Currently Airing" className="icon-md" />
 */
export const StatusIcon = ({ className, status }: StatusIconProps) => {
  const color = statusColors(status ?? 'unknown').replaceAll('bg', 'text')
  if (status === 'Currently Airing') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} ${color}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.364 19.364a9 9 0 1 0 -12.728 0" />
        <path d="M15.536 16.536a5 5 0 1 0 -7.072 0" />
        <path d="M12 13m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    )
  }
  if (status === 'Not yet aired') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} ${color}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.364 19.364a9 9 0 0 0 -9.721 -14.717m-2.488 1.509a9 9 0 0 0 -.519 13.208" />
        <path d="M15.536 16.536a5 5 0 0 0 -3.536 -8.536m-3 1a5 5 0 0 0 -.535 7.536" />
        <path d="M12 12a1 1 0 1 0 1 1" />
        <path d="M3 3l18 18" />
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${color}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
