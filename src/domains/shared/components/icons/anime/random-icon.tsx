import type { IconProps } from '@shared/types'
export const RandomIcon = ({ className }: IconProps) => {
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
      <path d="m18 4 3 3-3 3M18 20l3-3-3-3" />
      <path d="M3 7h3a5 5 0 0 1 5 5 5 5 0 0 0 5 5h5M21 7h-5a4.978 4.978 0 0 0-3 1m-4 8a4.984 4.984 0 0 1-3 1H3" />
    </svg>
  )
}
