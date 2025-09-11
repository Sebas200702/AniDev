import { useWindowWidth } from '@store/window-width'
import { NexPrevBtnSlideList } from 'domains/anime/components/slider/next-prev-btn-slider-list'
import { useEffect, useRef } from 'react'

export const AnimeCharacterLoader = () => {
  const characters = Array.from({ length: 12 }, (_, index) => index)

  const groups = Array.from({ length: Math.ceil(characters.length / 4) }).map(
    (_, groupIndex) => {
      return characters.slice(groupIndex * 4, (groupIndex + 1) * 4)
    }
  )
  const totalGroups = groups.length

  type GroupWithClone = {
    items: number[]
    originalIndex: number
    cloneBlock: 0 | 1 | 2
  }
  const extendedGroups: GroupWithClone[] = []
  for (let block: 0 | 1 | 2 = 0 as 0; block <= 2; block++) {
    groups.forEach((items, idx) => {
      extendedGroups.push({
        items,
        originalIndex: idx,
        cloneBlock: block as 0 | 1 | 2,
      })
    })
  }

  const listRef = useRef<HTMLUListElement>(null)
  const { width: windowWidth } = useWindowWidth()

  useEffect(() => {
    const ul = listRef.current
    if (!ul) return

    const clientW = ul.clientWidth
    const groupWidth = clientW - 48
    const realBlockWidth = groupWidth * totalGroups

    ul.scrollLeft = realBlockWidth

    const prevBtn = ul.querySelector('.prev-button') as HTMLButtonElement
    const nextBtn = ul.querySelector('.next-button') as HTMLButtonElement
    if (!prevBtn || !nextBtn) return

    const handleClick = (direction: 'next' | 'prev') => {
      if (!ul) return
      const delta = direction === 'next' ? groupWidth : -groupWidth
      ul.scrollTo({ left: ul.scrollLeft + delta, behavior: 'smooth' })
    }
    nextBtn.addEventListener('click', () => handleClick('next'))
    prevBtn.addEventListener('click', () => handleClick('prev'))

    const onScroll = () => {
      if (!ul) return
      const sl = ul.scrollLeft

      if (sl + 1 < groupWidth) {
        ul.scrollLeft = sl + realBlockWidth
      } else if (sl + clientW > realBlockWidth * 2 - 1 + clientW) {
        ul.scrollLeft = sl - realBlockWidth
      }
    }
    ul.addEventListener('scroll', onScroll)

    const updateButtonsVisibility = () => {
      if (windowWidth && windowWidth < 768) {
        prevBtn.style.display = 'none'
        nextBtn.style.display = 'none'
      } else {
        prevBtn.style.display = 'flex'
        nextBtn.style.display = 'flex'
      }
    }
    updateButtonsVisibility()

    return () => {
      nextBtn.removeEventListener('click', () => handleClick('next'))
      prevBtn.removeEventListener('click', () => handleClick('prev'))
      ul.removeEventListener('scroll', onScroll)
    }
  }, [windowWidth, totalGroups])

  return (
    <ul
      ref={listRef}
      className="custom-scrollbar grid grid-cols-1 gap-4 overflow-x-hidden overflow-y-auto md:grid-cols-2 md:gap-6"
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <li key={index}>
          <div className="flex aspect-[100/30] h-full w-full animate-pulse flex-row justify-between overflow-hidden rounded-md bg-zinc-800 duration-300">
            <div className="aspect-[225/330] h-full animate-pulse bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
            <div className="aspect-[225/330] h-full animate-pulse bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
          </div>
        </li>
      ))}
    </ul>
  )
}
