import { NextPrevIcon } from '@components/icons/next-prev-icon'

/**
 * Interface for the NexPrevBtnCarousel component props.
 *
 * @interface NexPrevBtnCarouselProps
 * @property {function} action - The function to call when the button is clicked.
 * @property {string} label - The label for the button, indicating 'Next' or 'Previous'.
 */
interface NexPrevBtnCarouselProps {
  /**
   * The function to call when the button is clicked.
   *
   * @type {function}
   */
  action: () => void
  /**
   * The label for the button, indicating 'Next' or 'Previous'.
   *
   * @type {string}
   */
  label: string
}

/**
 * NexPrevBtnCarousel component renders the next and previous buttons for the carousel.
 *
 * @description This component provides navigation controls for the carousel, allowing users to move
 * between carousel items. It displays a button with appropriate styling based on whether
 * it's a 'Next' or 'Previous' button.
 *
 * The component renders a button element containing the NextPrevIcon. The button includes
 * hover effects and proper focus states for accessibility. When clicked, it calls the provided
 * action function to navigate the carousel. For 'Next' buttons, the icon is rotated 180 degrees.
 *
 * The button uses backdrop blur effects and semi-transparent backgrounds to ensure it's visible
 * against various backgrounds while maintaining the overall design aesthetic. The component is
 * responsive and adjusts its size based on screen dimensions.
 *
 * The component includes a screen-reader only text label to ensure accessibility for users
 * with assistive technologies.
 *
 * @param {NexPrevBtnCarouselProps} props - The props for the component
 * @param {function} props.action - The function to call when the button is clicked
 * @param {string} props.label - The label for the button, indicating 'Next' or 'Previous'
 * @returns {JSX.Element} The rendered next/previous button
 *
 * @example
 * <NexPrevBtnCarousel action={handleNext} label="Next" />
 */
export const NexPrevBtnCarousel = ({
  action,
  label,
}: NexPrevBtnCarouselProps): JSX.Element => {
  return (
    <button
      type="button"
      className={`group h-12 w-12 cursor-pointer items-center justify-center rounded-lg backdrop-blur-sm focus:outline-none md:h-16 md:w-16 ${label === 'Next' ? 'rotate-180' : ''}`}
      onClick={action}
    >
      <span className="bg-Primary-900/40 group-hover:bg-Primary-800/50 inline-flex h-full w-full items-center justify-center rounded-lg">
        <NextPrevIcon className="h-4 w-4 md:h-5 md:w-5" />
        <span className="sr-only">{label}</span>
      </span>
    </button>
  )
}
