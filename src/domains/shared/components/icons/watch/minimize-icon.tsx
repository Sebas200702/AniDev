import type { IconProps } from '@shared/types'

export const MinimizeIcon = ({ className }: IconProps) => {
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
      <path d="M6 10h4V6M4 4l6 6M18 14h-4v4M14 14l6 6" />
    </svg>
  )
}
