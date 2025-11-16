import type { CharacterImages } from '@character/types'
import { NextPrevIcon } from '@shared/components/icons/watch/next-prev-icon'
import { useFetch } from '@shared/hooks/useFetch'
import { useHorizontalScroll } from '@shared/hooks/useHorizontalScroll' // Importa tu hook
import { useWindowWidth } from '@shared/hooks/window-width'
import { CharacterImage } from '@user/components/user-profile/character-image'

interface Props {
  id: number
}

export const CharacterImagesColection = ({ id }: Props) => {
  const { data, loading } = useFetch<CharacterImages[]>({
    url: `/characters/getCharacterImage?anime_id=${id}&limit_count=12`,
  })
  const { width: windowWidth } = useWindowWidth()

  const { listRef, showPrev, showNext, scrollNext, scrollPrev } =
    useHorizontalScroll({
      mobileBreakpoint: 768,
      scrollPadding: 32,
    })

  const createGroups = (characters: CharacterImages[]) => {
    let itemsPerGroup = 2

    if (windowWidth && windowWidth >= 1280) {
      itemsPerGroup = 4
    } else if (windowWidth && windowWidth >= 768) {
      itemsPerGroup = 3
    }

    return Array.from({
      length: Math.ceil(characters.length / itemsPerGroup),
    }).map((_, groupIndex) => {
      return characters.slice(
        groupIndex * itemsPerGroup,
        (groupIndex + 1) * itemsPerGroup
      )
    })
  }

  const groups = data ? createGroups(data) : []

  if (!data || loading)
    return (
      <div className="flex w-full flex-col gap-3 py-4">
        <div className="bg-Primary-700 h-6 w-1/3 animate-pulse rounded-md transition-all duration-300 md:mx-8 xl:h-[30px]"></div>

        <div className="relative overflow-hidden">
          <div className="no-scrollbar flex w-full flex-row gap-8 overflow-x-scroll scroll-smooth md:px-8">
            {Array.from({ length: 3 }).map((_, groupIndex) => (
              <ul key={groupIndex} className="flex w-full flex-none gap-4">
                {Array.from({
                  length: windowWidth && windowWidth >= 1280 ? 4 : 3,
                }).map((__, idx) => (
                  <div
                    key={idx}
                    className="aspect-square h-full w-full animate-pulse rounded-full bg-zinc-700 duration-300"
                  />
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    )

  return (
    <section className="flex flex-col gap-3 py-4">
      <header>
        <h3 className="text-l line-clamp-1 md:px-8">{data[0].anime_title}</h3>
      </header>

      <div className="relative overflow-hidden">
        {showPrev && (
          <button
            onClick={scrollPrev}
            className="prev-button group absolute top-1/2 -left-2 z-10 my-auto flex h-10 w-10 -translate-y-1/2 transform cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
          >
            <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
          </button>
        )}
        {showNext && (
          <button
            onClick={scrollNext}
            className="next-button group absolute top-1/2 -right-2 z-10 my-auto flex h-10 w-10 -translate-y-1/2 rotate-180 transform cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
          >
            <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
          </button>
        )}
        <div
          ref={listRef as React.RefObject<HTMLDivElement>}
          className="no-scrollbar flex w-full flex-row gap-4 overflow-x-scroll scroll-smooth md:gap-8 md:px-8"
        >
          {groups.map((group, groupIndex) => (
            <ul key={groupIndex} className="flex w-full flex-none gap-4">
              {group.map((character) => (
                <CharacterImage
                  key={character.character_id}
                  character={character}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
