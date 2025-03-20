interface SliderHeaderProps {
  title: string
}
/**
 * SliderHeader component renders the header for the anime slider.
 *
 * @description This component displays the title for the slider, providing context
 * for the content being displayed.
 *
 * The component is responsive and adjusts its layout based on the screen size, ensuring optimal
 * viewing experience.
 *
 * @returns {JSX.Element} The rendered header for the slider.
 *
 * @example
 * <SliderHeader title="Popular Anime" />
 */
export const SliderHeader = ({ title }: SliderHeaderProps): JSX.Element => {
  return (
    <header className="flex items-center space-x-4 px-4 py-4 md:px-20">
      <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
      <h3 className="text-lx font-bold ">{title}</h3>
    </header>
  )
}
