export const ArtistInfoLoader = () => {
  return (
    <div

    className="relative flex flex-col gap-6 md:p-6  p-4 row-start-2 bg-Complementary animate-pulse duration-300 md:rounded-3xl"
  >
     <h3 className="text-lx z-20 ">About the artist </h3>
    <div className="relative z-20 flex w-full md:max-w-100 max-w-80 flex-row items-center gap-6 rounded-full p-2">
        <div className="flex  h-20  w-20 bg-Primary-800 animate-pulse duration-300 overflow-hidden rounded-full"></div>
        <div className="flex flex-col gap-2">
            <div className="h-5 w-32 bg-Primary-800 animate-pulse rounded-md duration-300"></div>
            <div className="h-4 w-20 bg-Primary-800 animate-pulse rounded-md duration-300"></div>
        </div>
    </div>

    <div className="flex flex-col md:gap-3 gap-2">
        <div className="md:h-5 w-[90%] h-4 bg-Primary-800 animate-pulse rounded-md duration-300"></div>
        <div className="md:h-5 w-[70%] h-4 bg-Primary-800 animate-pulse rounded-md duration-300"></div>
        <div className="md:h-5 w-[80%] h-4 bg-Primary-800 animate-pulse rounded-md duration-300"></div>
    </div>
    </div>
  )
}
