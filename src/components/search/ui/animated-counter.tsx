import { useEffect, useState } from 'react'

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
    <div className="relative w-6 h-8 overflow-hidden mx-0.5 bg-gray-800/20 rounded shadow-sm">
      <div
        className="absolute w-full transition-all duration-500 ease-in-out"
        style={{
          top: isLoading ? `-${currentRandomIndex * 100}%` : `-${digit * 100}%`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="flex items-center justify-center w-full h-8 text-sm font-medium text-gray-300"
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  )
}

interface AnimatedCounterProps {
  value: number
  isLoading?: boolean
  className?: string
}

type Digit = number | '-'

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
            className="flex items-center justify-center w-6 h-8 mx-0.5 text-sm font-medium text-gray-300 bg-gray-800/20 rounded shadow-sm"
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
