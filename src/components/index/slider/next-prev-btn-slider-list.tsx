import { NextPrevIcon } from '@components/icons/next-prev-icon'

/**
 * NexPrevBtnSlideList component renders navigation buttons for slider components.
 *
 * @description This component provides navigation controls for slider components, allowing users to move
 * between slider items. It displays a button with appropriate styling based on the provided label and styles.
 *
 * The component renders a navigation element containing a button with the NextPrevIcon. The button includes
 * hover effects and proper focus states for accessibility. The navigation element uses gradient backgrounds
 * to ensure it blends well with the slider content while maintaining visibility.
 *
 * The component is responsive and remains hidden on smaller screens, appearing only on medium and larger
 * displays. The positioning of the navigation element is controlled through the provided styles prop,
 * allowing for flexible implementation in different slider contexts.
 *
 * @param {NexPrevBtnSlideListProps} props - The props for the component
 * @param {string} props.label - The label for the button, used for identification and accessibility
 * @param {string} props.styles - Additional CSS classes to apply to the navigation element
 * @returns {JSX.Element} The rendered navigation button for slider components
 *
 * @example
 * <NexPrevBtnSlideList label="prev" styles="left-0" />
 */
interface NexPrevBtnSlideListProps {
  label: string
  styles: string
}
export const NexPrevBtnSlideList = ({
  label,
  styles,
}: NexPrevBtnSlideListProps) => {
  return (
    <nav
      className={` ${label} ${styles} to-Primary-950/90 absolute top-0 bottom-0 z-20  h-full w-20 items-center justify-start bg-gradient-to-l from-transparent md:flex`}
    >
      <button
        className="group bg-enfasisColor z-10 my-auto flex h-16 w-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-300 ease-in-out focus:outline-none"
        aria-label="Next"
      >
        <NextPrevIcon className="h-3 w-3 md:h-4 md:w-4" />
      </button>
    </nav>
  )
}
