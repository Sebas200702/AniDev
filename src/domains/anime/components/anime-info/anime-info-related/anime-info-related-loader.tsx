import { Loader } from '@shared/components/loader'
export const AnimeRelatedLoader = () => {
  return (
    <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Loader
          key={i + 1}
          className="mx-auto flex aspect-[100/30] h-full w-full flex-row bg-zinc-800 md:max-h-36"
        >
          <Loader className="aspect-[225/330] h-full rounded-l-lg bg-zinc-700 object-cover object-center md:max-h-36" />
        </Loader>
      ))}
    </ul>
  )
}
