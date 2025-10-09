export const AnimeCharacterLoader = () => {
  return (
    <>
      {Array.from({ length: 20 }).map((_, index) => (
        <li key={index}>
          <div className="flex aspect-[100/30] h-full w-full animate-pulse flex-row justify-between overflow-hidden rounded-md bg-zinc-800 duration-300">
            <div className="aspect-[225/330] h-full animate-pulse bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
            <div className="aspect-[225/330] h-full animate-pulse bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
          </div>
        </li>
      ))}
    </>
  )
}
