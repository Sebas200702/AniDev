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
      className={` ${label} ${styles} to-Primary-950/90 absolute top-0 bottom-0 z-20 hidden h-full w-20 items-center justify-end bg-gradient-to-r from-transparent md:flex`}
    >
      <button
        className="group bg-enfasisColor z-10 my-auto h-16 w-10 cursor-pointer rounded-lg transition-all duration-300 ease-in-out focus:outline-none"
        aria-label="Siguiente"
      >
        <svg
          className="mx-auto my-auto h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M7 7l5 5-5 5M13 7l5 5-5 5"></path>
        </svg>
      </button>
    </nav>
  )
}
