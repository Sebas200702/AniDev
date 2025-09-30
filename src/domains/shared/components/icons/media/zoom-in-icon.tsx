import type { IconProps } from '@shared/types'

export const ZoomInIcon = ({ className }: IconProps) => {
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
      <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M7 10h6M10 7v6M21 21l-6-6" />
    </svg>
  )
}
