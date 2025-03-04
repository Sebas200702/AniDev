import { NextPrevIcon } from '@components/icons/next-prev-icon'

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
      className={` ${label} ${styles} to-Primary-950/90 absolute top-0 bottom-0 z-20 hidden h-full w-20 items-center justify-start bg-gradient-to-l from-transparent md:flex`}
    >
      <button
        className="group bg-enfasisColor z-10 my-auto h-16 w-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-300 ease-in-out focus:outline-none"
        aria-label="Siguiente"
      >
        <NextPrevIcon />
      </button>
    </nav>
  )
}
