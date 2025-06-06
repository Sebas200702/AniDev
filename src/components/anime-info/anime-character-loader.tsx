import { NexPrevBtnSlideList } from '@components/index/slider/next-prev-btn-slider-list'
import { useWindowWidth } from '@store/window-width'
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
      }

      else if (sl + clientW > realBlockWidth * 2 - 1 + clientW) {
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
      className=" flex overflow-x-scroll no-scrollbar px-8 py-4 gap-4"
    >

      <NexPrevBtnSlideList
        label="prev-button"
        styles="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
      />


      {extendedGroups.map((grp, idx) => (
        <section
          key={`${grp.cloneBlock}-${grp.originalIndex}-${idx}`}
          className="grid xl:grid-cols-2 grid-cols-1 min-w-full gap-4"
        >
          {grp.items.map((character) => (
            <li key={`${grp.cloneBlock}-${grp.originalIndex}-${character}`}>
              {/* Cada placeholder es un div con animate-pulse */}
              <div className="w-full md:h-28 h-20 rounded-xl bg-zinc-700 animate-pulse duration-300"></div>
            </li>
          ))}
        </section>
      ))}

      {/* Botón “Siguiente” */}
      <NexPrevBtnSlideList
        label="next-button"
        styles="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 z-10"
      />
    </ul>
  )
}
