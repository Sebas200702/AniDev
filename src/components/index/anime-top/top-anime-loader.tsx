export const AnimeTopLoader = () => {
  return (
    <div className="relative">
      <header className="mb-10 flex w-full flex-row items-center justify-around gap-4">
        <div className="mt-2 flex-1 border-t border-white/20"></div>
        <div className="h-6 w-28 rounded-md bg-zinc-800 md:h-8 md:w-40"></div>
        <div className="mt-2 flex-1 border-t border-white/20"></div>
      </header>
      <div className="justify-aroundmx-auto grid grid-cols-2 items-center gap-4 px-4 md:px-20 xl:gap-x-12">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="flex w-full flex-row items-center gap-2"
            >
              <div className="h-full w-full max-w-18"></div>
              <div className="w-full bg-Complementary animate-pulse duration-300 ">
              <div className="aspect-[225/330] h-auto w-full max-w-32 animate-pulse rounded-lg bg-zinc-800 "></div>
              </div>
              </div>

          ))}
      </div>
    </div>
  )
}
