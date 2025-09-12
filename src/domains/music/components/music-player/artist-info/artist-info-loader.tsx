export const ArtistInfoLoader = () => {
  return (
    <div className="bg-Complementary relative row-start-2 flex animate-pulse flex-col gap-6 p-4 duration-300 md:rounded-3xl md:p-6">
      <h3 className="text-lx z-20">About the artist </h3>
      <div className="relative z-20 flex w-full max-w-80 flex-row items-center gap-6 rounded-full p-2 md:max-w-100">
        <div className="bg-Primary-800 flex h-20 w-20 animate-pulse overflow-hidden rounded-full duration-300"></div>
        <div className="flex flex-col gap-2">
          <div className="bg-Primary-800 h-5 w-32 animate-pulse rounded-md duration-300"></div>
          <div className="bg-Primary-800 h-4 w-20 animate-pulse rounded-md duration-300"></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:gap-3">
        <div className="bg-Primary-800 h-4 w-[90%] animate-pulse rounded-md duration-300 md:h-5"></div>
        <div className="bg-Primary-800 h-4 w-[70%] animate-pulse rounded-md duration-300 md:h-5"></div>
        <div className="bg-Primary-800 h-4 w-[80%] animate-pulse rounded-md duration-300 md:h-5"></div>
      </div>
    </div>
  )
}
