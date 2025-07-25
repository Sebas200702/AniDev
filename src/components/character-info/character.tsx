import { CharacterAside } from '@components/character-info/character-aside'
import { CharacterHeader } from '@components/character-info/character-header'
import { DinamicBanner } from '@components/anime-info/dinamic-banner'
import { Overlay } from '@components/layout/overlay'
import { getCharacterData } from '@utils/get-character-data'
import { useEffect, useState } from 'react'
import type { CharacterDetails } from 'types'

interface Props {
  slug: string
}

export const CharacterInfo = ({ slug }: Props) => {
  const [character, setCharacter] = useState<CharacterDetails>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await getCharacterData(slug)
      if (data) {
        setCharacter(data)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-w-full">
        <div className="fixed aspect-[1080/600] h-[60dvh] w-full animate-pulse bg-zinc-800 duration-300">
          <div className="to-Primary-950/100 absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent transition-all duration-300 ease-in-out" />
        </div>
        <div className="z-10 mb-10 grid w-full grid-cols-1 gap-10 px-4 pt-[35dvh] md:mb-20 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5">
          <div className="row-span-2 row-start-2 -mt-4 flex flex-col gap-6 md:row-start-1 md:mt-0 md:gap-8 md:p-0">
            <div className="aspect-[225/330] h-0 w-full animate-pulse rounded-lg bg-zinc-800 px-8 duration-300 ease-in-out md:h-auto"></div>
          </div>
          <div className="flex h-full w-full flex-col justify-end gap-6 md:col-span-2 md:gap-8 xl:col-span-4">
            <div className="mx-auto h-12 w-[80%] animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:mx-0 md:h-16 xl:h-20"></div>
            <div className="mx-auto h-6 w-[60%] animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:mx-0 md:h-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white">Character not found</p>
      </div>
    )
  }

  return (
    <>
      <DinamicBanner
        banners={character.animes.map(
          (anime) => anime.banner_image ?? anime.image_large_webp ?? ''
        )}
      />

      <article className="relative z-10 mb-10 grid w-full grid-cols-1 gap-10 px-4 pt-[35dvh] md:mb-20 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5">
        <Overlay className="to-Primary-950 via-Primary-950/20 absolute inset-0 bg-gradient-to-l via-60%" />
        <Overlay className="to-Primary-950/100 via-Primary-950 h-full w-full bg-gradient-to-b via-[38dvh] md:via-[55dvh]" />

        <CharacterAside character={character} />
        <CharacterHeader character={character} />
      </article>
    </>
  )
}
