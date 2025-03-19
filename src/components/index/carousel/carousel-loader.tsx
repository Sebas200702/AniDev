export const LoadingCarousel = () => (
  <div className="carousel-anime-banner relative h-[65vh] animate-pulse bg-zinc-900 md:h-[90vh]">
    <div className="relative flex  w-full md:h-[90vh] h-[65vh] flex-shrink-0 flex-col items-center  md:flex-row">
      <div className="z-10 mx-auto -mt-14 flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4 p-6 text-white md:mr-16 md:ml-8 md:h-auto md:items-start md:justify-normal">
        <div className="z-30 h-20 w-full animate-pulse rounded-lg bg-zinc-800 md:mt-4 md:mb-4"></div>
        <div className="z-30 hidden h-12 w-full animate-pulse rounded-lg bg-zinc-800 md:flex"></div>

        <div className="flex w-full flex-row items-center gap-4 md:mt-2">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-800 md:flex"></div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-800"></div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-[20%] left-1/2 z-30 flex h-4 w-44 -translate-x-1/2 animate-pulse rounded-lg bg-zinc-800 md:bottom-[8%]"></div>
  </div>
)
