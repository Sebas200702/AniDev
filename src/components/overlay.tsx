interface Props {
  heigth: string
  color: string
  width: string
  gradient: string
  rounded: string
  hover: string
  zIndex?: number
}
export const Overlay = ({
  heigth,
  color,
  width,
  gradient,
  hover,
  rounded,
  zIndex,
  }: Props) => {
  return (
    <div
      className={`absolute right-0 bottom-0 left-0 z-${zIndex ?? '1'} h-${heigth} w-${width} rounded-${rounded} bg-gradient-to-${gradient} from-transparent to-${color}  transition-all duration-400 ease-in-out md:group-hover:${hover} `}
    />
  )
}
