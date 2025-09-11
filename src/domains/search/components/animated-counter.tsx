import { useEffect, useState } from 'react'

/**
 * DigitFlip component handles the animation of individual digits in the counter.
 *
 * @description This component creates a flip animation effect for a single digit,
 * showing random numbers during loading state and smoothly transitioning to the
 * target number when loading is complete.
 *
 * @param {Object} props - Component props
 * @param {number} props.digit - The target digit to display
 * @param {boolean} props.isLoading - Whether the digit should show loading animation
 *
 * @returns {JSX.Element} A single animated digit
 */
interface DigitFlipProps {
  digit: number
  isLoading: boolean
}

const DigitFlip = ({ digit, isLoading }: DigitFlipProps) => {
  const [currentRandomIndex, setCurrentRandomIndex] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentRandomIndex(Math.floor(Math.random() * 10))
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <div className="relative mx-0.5 h-8 w-6 overflow-hidden rounded bg-gray-800/20 shadow-sm">
      <div
        className="absolute w-full transition-all duration-500 ease-in-out"
        style={{
          top: isLoading ? `-${currentRandomIndex * 100}%` : `-${digit * 100}%`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="flex h-8 w-full items-center justify-center text-sm font-medium text-gray-300"
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Props for the AnimatedCounter component
 */
interface AnimatedCounterProps {
  /** The numeric value to display */
  value: number
  /** Whether to show loading animation */
  isLoading?: boolean
  /** Additional CSS classes to apply */
  className?: string
}

/** Type definition for individual digits in the counter */
type Digit = number | '-'

/**
 * AnimatedCounter component displays a number with animated digit transitions.
 *
 * @description This component creates an animated counter that displays numbers
 * with a flip animation effect. Each digit animates independently, showing
 * random numbers during loading state and smoothly transitioning to the target
 * number when loading is complete.
 *
 * Features:
 * - Individual digit animations
 * - Loading state with random number cycling
 * - Support for negative numbers
 * - Smooth transitions between numbers
 * - Responsive design
 *
 * @param {AnimatedCounterProps} props - Component props
 * @param {number} props.value - The number to display
 * @param {boolean} [props.isLoading=false] - Whether to show loading animation
 * @param {string} [props.className=''] - Additional CSS classes
 *
 * @returns {JSX.Element} An animated counter display
 *
 * @example
 * // Basic usage
 * <AnimatedCounter value={42} />
 *
 * // With loading state
 * <AnimatedCounter value={42} isLoading={true} />
 *
 * // With custom classes
 * <AnimatedCounter value={42} className="text-lg" />
 */
export const AnimatedCounter = ({
  value = 0,
  isLoading = false,
  className = '',
}: AnimatedCounterProps) => {
  const [digits, setDigits] = useState<Digit[]>([0])

  useEffect(() => {
    const digitArray: Digit[] = Math.abs(value)
      .toString()
      .padStart(1, '0')
      .split('')
      .map(Number)

    if (value < 0) {
      digitArray.unshift('-')
    }

    setDigits(digitArray)
  }, [value])

  return (
    <div className={`inline-flex items-center ${className}`}>
      {digits.map((digit, index) =>
        digit === '-' ? (
          <div
            key={index}
            className="mx-0.5 flex h-8 w-6 items-center justify-center rounded bg-gray-800/20 text-sm font-medium text-gray-300 shadow-sm"
          >
            -
          </div>
        ) : (
          <DigitFlip key={index} digit={digit} isLoading={isLoading} />
        )
      )}
    </div>
  )
}
