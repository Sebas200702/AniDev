import { Loader } from '@shared/components/loader'
export const AnimeMusicLoader = () => {
  return (
    <div className="z-10 flex flex-col gap-8 rounded-lg p-4 md:p-6">
      <h2 className="text-lxx font-bold">Anime Music</h2>

      <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        {Array.from({ length: 8 }, (_, i) => (
          <Loader
            key={i + 1}
            className="mx-auto flex aspect-[100/30] h-full w-full animate-pulse flex-row rounded-lg bg-zinc-800 md:max-h-36"
          >
            <Loader className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></Loader>
          </Loader>
        ))}
      </ul>
    </div>
  )
}
