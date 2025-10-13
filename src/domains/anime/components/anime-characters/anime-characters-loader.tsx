import { Loader } from '@shared/components/loader'
export const AnimeCharacterLoader = () => {
  return (
    <>
      {Array.from({ length: 20 }).map((_, index) => (
        <Loader
          key={index}
          className="flex aspect-[100/30] h-full w-full  flex-row justify-between overflow-hidden  bg-zinc-800 "
        >
          <Loader className="aspect-[225/330] h-full  bg-zinc-700 object-cover object-center  md:max-h-36" />
          <Loader className="aspect-[225/330] h-full bg-zinc-700 object-cover object-center  md:max-h-36" />
        </Loader>
      ))}
    </>
  )
}
