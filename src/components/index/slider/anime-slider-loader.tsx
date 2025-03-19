export const AnimeSliderLoader = () => {
  return (
    <div className="relative flex w-[100dvw] flex-col">
      <header className="flex w-full flex-row items-center justify-center space-x-4 px-4 py-4 md:px-20">
        <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
        <span className="inline-flex h-7.5 w-32 animate-pulse rounded-lg bg-zinc-800 xl:h-10.5"></span>
        <div className="flex-1"></div>
      </header>
      <div className="relative overflow-hidden px-4 py-4 md:px-20">
        <div className="anime-list flex w-full flex-row gap-10 overflow-x-auto">
          {Array(24)
            .fill(0)
            .map((_, i) => (
              <div
                key={i + 1}
                className="flex h-auto w-full min-w-[calc((100dvw-32px)/2.4)] flex-col items-center duration-200 md:min-w-[calc((100dvw-280px)/4)] xl:min-w-[calc((100dvw-360px)/6)]"
              >
                <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 md:aspect-[225/330]"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
