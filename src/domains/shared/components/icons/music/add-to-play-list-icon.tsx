import type { IconProps } from '@shared/types'

export const AddToPlayList = ({ className }: IconProps) => {
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
      <path d="M19 8H5M5 12h9M11 16H5M15 16h6M18 13v6" />
    </svg>
  )
}
