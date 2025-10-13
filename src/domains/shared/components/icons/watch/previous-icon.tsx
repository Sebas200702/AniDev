import type { IconProps } from '@shared/types'

export const PreviousIcon = ({ className }: IconProps) => {
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
      <path d="M21 5v14l-8-7zM10 5v14l-8-7z" />
    </svg>
  )
}
