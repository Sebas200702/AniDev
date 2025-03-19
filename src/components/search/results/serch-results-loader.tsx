export const SearchResultsLoader = () => {
  return (
    <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-2 gap-6 md:grid-cols-4 xl:grid-cols-6 xl:gap-2">
      {Array(30)
        .fill(0)
        .map((_, i) => (
          <div
            key={i + 1}
            className="flex aspect-[225/330] h-full w-full animate-pulse flex-col rounded-lg bg-zinc-700 p-4 duration-200"
          ></div>
        ))}
    </div>
  )
}
