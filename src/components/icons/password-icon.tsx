interface Props {
  class?: string
}
export const PasswordIcon = ({ class: className }: Props) => {
  return (
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
      <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6z"></path>
      <path d="M11 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4"></path>
    </svg>
  )
}
