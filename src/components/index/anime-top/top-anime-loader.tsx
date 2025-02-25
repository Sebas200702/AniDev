export const AnimeTopLoader = () => {
  return (
    <div className="relative">
      <header className="flex w-full flex-row items-center justify-around gap-4 p-4">
        <div className="mt-2 flex-1 border-t border-white/20"></div>
        <div className="h-6 w-28 rounded-md bg-zinc-800 md:h-8 md:w-40"></div>

        <div className="mt-2 flex-1 border-t border-white/20"></div>
      </header>
      <div className="grid grid-cols-2 items-center justify-between md:grid-cols-5 xl:grid-cols-10">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i + 1} className="flex flex-col items-center p-4">
              <div className="aspect-[225/330] h-auto w-full max-w-32 animate-pulse rounded-lg bg-zinc-800 md:aspect-[225/330]"></div>
              <div className="mt-2 h-6 w-32 animate-pulse rounded-lg bg-zinc-800"></div>
            </div>
          ))}
      </div>
    </div>
  )
}
