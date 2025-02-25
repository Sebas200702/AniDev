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
        <svg
          className="h-3 w-3 text-white md:h-4 md:w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    </button>
  )
}
