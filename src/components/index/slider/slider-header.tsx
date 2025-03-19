interface SliderHeaderProps {
  title: string
}
export const SliderHeader = ({ title }: SliderHeaderProps) => {
  return (
    <header className="flex items-center space-x-4 px-4 py-4 md:px-20">
      <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
      <h3 className="text-lx font-bold ">{title}</h3>
    </header>
  )
}
