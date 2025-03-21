interface SliderHeaderProps {
  title: string
}
/**
 * SliderHeader component renders the header for the anime slider.
 *
 * @description This component displays the title for the slider, providing context
 * for the content being displayed. The header consists of a vertical accent bar and
 * the title text, creating a consistent visual hierarchy across the application.
 *
 * The component is responsive and adjusts its layout based on the screen size, ensuring optimal
 * viewing experience. On mobile devices, it uses minimal horizontal padding, while on medium
 * and larger screens, it increases the padding for better visual balance. The accent bar
 * also scales appropriately on extra-large screens to maintain proportions.
 *
 * The UI displays a vertical colored accent bar followed by the title text in a bold font.
 * The styling is consistent with other section headers throughout the application to provide
 * a cohesive user experience.
 *
 * @param {SliderHeaderProps} props - The component props
 * @param {string} props.title - The title text to display in the header
 * @returns {JSX.Element} The rendered header for the slider with accent bar and title
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
