import { NextPrevIcon } from '@components/icons/next-prev-icon'

interface NexPrevBtnCarouselProps {
  action: () => void
  label: string
}
export const NexPrevBtnCarousel = ({
  action,
  label,
}: NexPrevBtnCarouselProps) => {
  return (
    <button
      type="button"
      className={`group h-12 w-12 cursor-pointer items-center justify-center rounded-lg backdrop-blur-sm focus:outline-none md:h-16 md:w-16 ${label === 'Next' ? 'rotate-180' : ''}`}
      onClick={action}
    >
      <span className="bg-Primary-900/40 group-hover:bg-Primary-800/50 inline-flex h-full w-full items-center justify-center rounded-lg">
        <NextPrevIcon />
        <span className="sr-only">{label}</span>
      </span>
    </button>
  )
}
