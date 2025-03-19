export const SearchResultsLoader = () => {
  return (
    <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-2 xl:gap-2 gap-6 md:grid-cols-4 xl:grid-cols-6">
      {Array(30)
        .fill(0)
        .map((_, i) => (
          <div
            key={i + 1}
            className="flex h-auto w-full animate-pulse flex-col rounded-lg p-4 bg-zinc-700 duration-200 h-full aspect-[225/330] "
          >
            
        ))}
    </div>
  )
}
