export const AnimeSliderLoader = () => {
    return (
        <div className="relative mx-auto w-[100dvw]">
          <div className="mt-1 flex flex-row items-center justify-center space-x-4 p-4 md:mt-0 mb-6">
            <span className="md:ml-16 inline-flex h-6 w-24 animate-pulse rounded-lg bg-zinc-800  md:h-8 md:w-32"></span>
            <div className="flex-1 border-t border-white/20 md:mt-2"></div>
          </div>
          <div className="relative overflow-hidden">
            <div className="anime-list flex w-full flex-row overflow-x-auto md:px-20 px-4 gap-10">
              {Array(24)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i + 1}
                    className="flex h-auto w-full min-w-[calc((100dvw-32px)/2.4)] flex-col items-center  duration-200 md:min-w-[calc((100dvw-280px)/4)] xl:min-w-[calc((100dvw-360px)/6)]"
                  >
                    <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 md:aspect-[225/330]"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )
}
