export const AnimeTopLoader = () => {
  return (
    <div className="relative px-4 md:px-20">
      <header className="mb-10 flex w-full flex-row items-center gap-4">
        <div className="bg-enfasisColor h-10 w-2 rounded-lg"></div>
        <div className="h-6 w-28 rounded-md bg-zinc-800 md:h-8 md:w-40"></div>
      </header>
      <div className="mx-auto grid grid-cols-1 items-center justify-around gap-4 xl:grid-cols-2 xl:gap-x-12">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="flex w-full flex-row items-center gap-2"
            >
              <div className="h-full w-full max-w-18"></div>
              <div className="bg-Complementary w-full animate-pulse rounded-lg duration-300">
                <div className="aspect-[225/330] h-auto w-full max-w-20 animate-pulse rounded-lg bg-zinc-800 md:max-w-32"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
