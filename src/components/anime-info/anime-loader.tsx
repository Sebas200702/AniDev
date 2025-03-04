import '@styles/anime-page.css'

export const AnimeLoader = () => {
  return (
    <div className="">
      <div className="relative -mt-16 aspect-[1080/600] h-[65dvh] w-full animate-pulse bg-zinc-800 duration-300">
        <div className="to-Primary-950/100 absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent transition-all duration-300 ease-in-out" />
      </div>
      <div className="anime-page flex flex-col">
        <div className="anime-aside p-8  md:p-0">
          <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
        <div className="flex h-full w-full flex-col justify-end gap-4 anime-header">
          <div className="h-20 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:w-[80%]"></div>

          <div className="md:h-15 h-20 md:w-90 w-60 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>

        <div className=" h-100 w-full animate-pulse rounded-lg anime-showbox bg-zinc-800 duration-300 ease-in-out  "></div>
        <div className='h-200 w-full animate-pulse rounded-lg  bg-zinc-800 duration-300 ease-in-out  '>

        </div>
      </div>
    </div>
  )
}
