export const SearchResultsLoader = () => {
  return (
    <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-2 gap-2  md:grid-cols-4 xl:grid-cols-6">
      {Array(30)
        .fill(0)
        .map((_, i) => (
          <div
            key={i + 1}
            className="flex h-auto w-full animate-pulse flex-col rounded-lg p-4 duration-200"
          >
            <div className="aspect-[225/330] h-full w-full animate-pulse rounded-lg bg-zinc-700 p-2 duration-200"></div>
          </div>
        ))}
    </div>
  )
}
