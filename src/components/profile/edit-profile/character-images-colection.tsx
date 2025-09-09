import { NextPrevIcon } from '@components/icons/next-prev-icon'
import { CharacterImage } from '@components/profile/edit-profile/character-image'
import { useFetch } from '@hooks/useFetch'
import { useWindowWidth } from '@store/window-width'
import { useEffect, useRef } from 'react'
import type { CharacterImages } from 'types'

interface Props {
  id: number
}

export const CharacterImagesColection = ({ id }: Props) => {
  const { data, loading } = useFetch<CharacterImages[]>({
    url: `api/getCharacterImage?anime_id=${id}&limit_count=12`,
  })
  const { width: windowWidth } = useWindowWidth()
  const listRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const prevBtn = container.parentElement?.querySelector(
      '.prev-button'
    ) as HTMLButtonElement
    const nextBtn = container.parentElement?.querySelector(
      '.next-button'
    ) as HTMLButtonElement

    if (!prevBtn || !nextBtn) return

    const clientWidth = container.clientWidth
    const groupWidth = clientWidth - 32

    const handleClick = (direction: 'next' | 'prev') => {
      if (!container) return
      const scrollAmount = direction === 'next' ? groupWidth : -groupWidth
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }

    const updateButtonsVisibility = () => {
      if (windowWidth && windowWidth < 768) {
        prevBtn.style.display = 'none'
        nextBtn.style.display = 'none'
        return
      }

      const { scrollLeft, scrollWidth, clientWidth } = container
      prevBtn.style.display = scrollLeft <= 0 ? 'none' : 'flex'

      nextBtn.style.display =
        scrollLeft >= scrollWidth - clientWidth - 10 ? 'none' : 'flex'
    }

    prevBtn.addEventListener('click', () => handleClick('prev'))
    nextBtn.addEventListener('click', () => handleClick('next'))
    container.addEventListener('scroll', updateButtonsVisibility)

    updateButtonsVisibility()

    return () => {
      prevBtn.removeEventListener('click', () => handleClick('prev'))
      nextBtn.removeEventListener('click', () => handleClick('next'))
      container.removeEventListener('scroll', updateButtonsVisibility)
    }
  }, [windowWidth, groups.length])

  if (!data || loading)
    return (
      <div className="py-4 flex flex-col gap-3 w-full">
        <div className="w-1/3 rounded-md md:mx-8 bg-Primary-700 xl:h-[30px] h-6 animate-pulse duration-300 transition-all"></div>

        <div className="relative overflow-hidden">
          <div
            className="flex flex-row w-full overflow-x-scroll gap-8 md:px-8 no-scrollbar  scroll-smooth"
          >
            {Array.from({ length: 3 }).map((_, groupIndex) => (
              <ul key={groupIndex} className="flex w-full flex-none gap-4 ">
                {Array.from({
                  length: windowWidth && windowWidth >= 1280 ? 4 : 3,
                }).map((__, idx) => (

                    <div key={idx} className=" w-full h-full aspect-square rounded-full bg-zinc-700  animate-pulse duration-300" />

                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    )

  return (
    <section className="py-4 flex flex-col gap-3">
      <header>
        <h3 className="text-l md:px-8 line-clamp-1">{data[0].anime_title}</h3>
      </header>
      <div className="relative overflow-hidden">
        <button
          className={`absolute prev-button -left-2 top-1/2 transform -translate-y-1/2    group  z-10 my-auto flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none    `}
        >
          <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
        </button>
        <button
          className={`absolute next-button -right-2 top-1/2 transform -translate-y-1/2 rotate-180   group  z-10 my-auto flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none    `}
        >
          <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
        </button>

        <div
          ref={listRef}
          className="flex flex-row w-full overflow-x-scroll md:gap-8 gap-4 md:px-8 no-scrollbar  scroll-smooth"
        >
          {groups.map((group, groupIndex) => (
            <ul key={groupIndex} className="flex w-full flex-none gap-4 ">
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
