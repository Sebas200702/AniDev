interface SliderHeaderProps {
  title: string
}
export const SliderHeader = ({ title }: SliderHeaderProps) => {
  return (
    <header className="flex items-center space-x-4 px-4 py-4 md:px-20">
      <h3 className="text-lx font-bold md:text-3xl">{title}</h3>
      <div className="flex-1 border-t border-white/20 md:mt-2"></div>
    </header>
  )
}
