import { memo } from "react"

export const Indicator = memo(
    ({
      index,
      currentIndex,
      onClick,
    }: {
      index: number
      currentIndex: number
      onClick: (index: number) => void
    }) => {
      return (
        <button
          onClick={() => onClick(index)}
          className={`h-3 rounded-full transition-all duration-300 ease-in-out ${
            currentIndex === index ? 'bg-enfasisColor w-8' : 'w-3 bg-white'
          }`}
          aria-current={currentIndex === index ? 'true' : 'false'}
          aria-label={`Slide ${index + 1}`}
        />
      )
    }
  )
