import { memo } from 'react'

/**
 * Indicator component renders navigation indicators for the carousel.
 *
 * @description This component allows users to see which item is currently active in the carousel
 * and navigate between items. It is implemented as a memoized function to prevent unnecessary
 * re-renders, improving performance especially when the carousel contains many items.
 *
 * The indicator visually distinguishes the active item with different styling (wider width and
 * emphasis color) while inactive indicators are shown as smaller white dots. When clicked,
 * the indicator triggers navigation to its corresponding carousel item through the provided
 * onClick callback.
 *
 * The component includes proper accessibility attributes such as aria-current and aria-label
 * to ensure screen readers can properly announce the current state and purpose of each indicator.
 * The transition effects provide visual feedback when the active state changes.
 *
 * @param {Object} props - The component props
 * @param {number} props.index - The index of the indicator
 * @param {number} props.currentIndex - The current active index in the carousel
 * @param {function} props.onClick - The function to call when the indicator is clicked
 * @returns {JSX.Element} The rendered indicator button
 *
 * @example
 * <Indicator index={1} currentIndex={0} onClick={(index) => console.log(index)} />
 */
export const Indicator = memo(
  ({
    index,
    currentIndex,
    onClick,
  }: {
    /**
     * The index of the indicator.
     */
    index: number
    /**
     * The current active index in the carousel.
     */
    currentIndex: number
    /**
     * The function to call when the indicator is clicked.
     *
     * @param {number} index - The index of the indicator that was clicked.
     */
    onClick: (index: number) => void
  }) => {
    return (
      <button
        onClick={() => onClick(index)}
        className={`h-3 cursor-pointer rounded-full transition-all duration-300 ease-in-out ${
          currentIndex === index ? 'bg-enfasisColor w-8' : 'w-3 bg-white'
        }`}
        aria-current={currentIndex === index ? 'true' : 'false'}
        aria-label={`Slide ${index + 1}`}
      />
    )
  }
)

