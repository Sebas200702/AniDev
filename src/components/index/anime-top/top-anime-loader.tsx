export const AnimeTopLoader = () => {
  return (
    <div className="relative">
      <header className=" flex w-full flex-row items-center space-x-4 py-4  px-4 md:px-20">
        <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
        <span className="inline-flex h-7.5 w-32 animate-pulse rounded-lg bg-zinc-800 xl:h-10.5"></span>
      </header>
      <div className="mx-auto grid grid-cols-1 items-center justify-around gap-4 px-4 py-4 md:px-20 xl:grid-cols-2 xl:gap-x-12">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="flex w-full flex-row items-center gap-2"
            >
              <div className="h-full w-full max-w-12 md:max-w-18"></div>
              <div className="bg-Complementary w-full animate-pulse rounded-lg duration-300">
                <div className="aspect-[225/330] h-auto w-full max-w-20 animate-pulse rounded-lg bg-zinc-800 md:max-w-32"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
