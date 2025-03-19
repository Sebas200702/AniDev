interface Props {
  className?: string
}
export const Overlay = ({ className }: Props) => {
  return (
    <div
      className={`absolute right-0 bottom-0 left-0 from-transparent ${className} transition-all duration-300 ease-in-out`}
    />
  )
}
