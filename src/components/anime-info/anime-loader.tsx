import '@styles/anime-page.css'

export const AnimeLoader = () => {
  return (
    <div className="">
      <div className="relative -mt-16 aspect-[1080/600] h-[65dvh] w-full animate-pulse bg-zinc-800 duration-300">
        <div className="to-Primary-950/100 absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent transition-all duration-300 ease-in-out" />
      </div>
      <div className="anime-page z-10 -mt-96 grid h-full w-full gap-4 px-4 md:-mt-56 md:gap-10 md:px-20 xl:gap-15">
        <div className="col-span-3 row-span-2 p-8 md:col-span-1 md:p-0">
          <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
        <div className="col-span-3 flex h-full w-full flex-col justify-end gap-4 md:col-span-2 xl:col-span-3 xl:mt-0">
          <div className="h-20 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:w-[80%]"></div>

          <div className="md:h-15 h-20 md:w-90 w-60 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>

        <div className="col-span-3 row-span-2 h-100 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:col-span-2 md:h-full"></div>
      </div>
    </div>
  )
}
