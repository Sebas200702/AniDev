export const PageCollectionLoader = () => {
  return (
    <div className="mx-auto flex flex-col gap-4">
      <div className="mb-6 h-20 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:h-10 md:w-96"></div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="bg-Primary-950 mx-auto flex aspect-[700/400] h-full w-full animate-pulse flex-row rounded-lg"
            >
              <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-800 object-cover object-center transition-all ease-in-out"></div>
            </div>
          ))}
      </div>
    </div>
  )
}
