import type { IconProps } from 'types'
export const ReplayIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
      <path d="M20 4v5h-5" />
    </svg>
  )
}
