import { Loader } from '@shared/components/loader'
export const AnimeLoader = () => {
  return (
    <div className="min-w-full">
      <Loader className="fixed aspect-[1080/600] h-[60dvh] w-full  bg-zinc-800 ">
        <div className="to-Primary-950/100 absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent transition-all duration-300 ease-in-out" />
      </Loader>
      <div className="z-10 mb-10 grid w-full grid-cols-1 gap-10 px-4 pt-[35dvh] md:mb-20 md:w-[calc(100dvw-80px)] md:grid-cols-3 md:px-20 xl:grid-cols-5">
        <div className="row-span-2 row-start-2 -mt-4 flex flex-col gap-6 md:row-start-1 md:mt-0 md:gap-8 md:p-0">
          <Loader className="aspect-[225/330] h-0 w-full   bg-zinc-800 px-8  md:h-auto" />
          <Loader className="h-10 w-full  bg-zinc-800 xl:h-12"></Loader>
        </div>
        <div className="flex h-full w-full flex-col justify-end gap-6 md:col-span-2 md:gap-8 xl:col-span-4">
          <Loader className="mx-auto h-8 w-[80%] rounded-lg bg-zinc-800  md:mx-0 md:h-12 xl:h-20"/>

          <Loader className="mx-auto h-8 w-full  bg-zinc-800 duration-300 ease-in-out md:mx-0 md:h-10 md:w-90"/>
        </div>

        <Loader className="row-span-2 flex w-full  flex-col gap-4 rounded-lg bg-zinc-800  md:col-span-2 xl:col-span-3">
          <div className="h-15 w-full"></div>
          <div className="aspect-video w-full"></div>
        </Loader>
        <div className="w-full animate-pulse px-10 md:px-0">
          <Loader className="mx-auto h-8 w-[80%] rounded-t-lg bg-zinc-700 xl:h-10"/>
          <Loader className="h-200  bg-zinc-800 duration-300 ease-in-out"/>
        </div>
      </div>
    </div>
  )
}
