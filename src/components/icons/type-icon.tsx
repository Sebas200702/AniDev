import { typeColors } from '@utils/type-colors'

export const TypeIcon = ({ className, type }: { className?: string, type: string }) => {
  const color = typeColors(type)
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
      className={`${className} ${color}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M16 3l-4 4l-4 -4" />
      <path d="M15 7v13" />
      <path d="M18 15v.01" />
      <path d="M18 12v.01" />
    </svg>
  )
}
