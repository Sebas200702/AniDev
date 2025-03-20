/**
 * FallIcon component renders an icon representing the fall season.
 *
 * This component takes an optional className prop to allow for custom styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional class name for custom styling
 */
export const FallIcon = ({ className }: { className?: string }) => {
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
      <path d="M12.014 21.514v-3.75M5.93 9.504l-.43 1.604a4.986 4.986 0 0 0 3.524 6.105c.997.268 1.993.535 2.99.801v-3.44a4.983 4.983 0 0 0-3.676-4.426L5.93 9.504z" />
      <path d="M13.744 11.164a4.903 4.903 0 0 0 1.433-3.46 4.884 4.884 0 0 0-1.433-3.46l-1.73-1.73-1.73 1.73a4.912 4.912 0 0 0-1.433 3.46 4.894 4.894 0 0 0 1.433 3.46" />
      <path d="m18.099 9.504.43 1.604a4.986 4.986 0 0 1-3.525 6.105l-2.99.801v-3.44a4.983 4.983 0 0 1 3.677-4.426l2.408-.644z" />
    </svg>
  )
}
